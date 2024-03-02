import migrations from './actions';
import MongoConnection from './connection';
import getModel from './model';
import Log from '../tools/logger';
import type { IMigration, IMigrationFile } from './types';
import type { Connection } from 'mongoose';

export default class Migrations {
  private readonly _client: MongoConnection;

  constructor() {
    this._client = new MongoConnection();
  }

  private _migrationClient: Connection | undefined;

  private get migrationClient(): Connection | undefined {
    return this._migrationClient;
  }

  private set migrationClient(value: Connection | undefined) {
    this._migrationClient = value;
  }

  private get client(): MongoConnection {
    return this._client;
  }

  async init(): Promise<void> {
    this.migrationClient = await this._client.init();

    const lastMigration = await this.getLastMigration();
    lastMigration.forEach((m) => {
      delete migrations[m];
    });

    if (Object.keys(migrations).length === 0) {
      Log.log('Migrations', 'Nothing to migrate');
      return;
    }

    await this.migrate(migrations);
  }

  disconnect(): void {
    this.client.disconnect().catch((err) => {
      Log.error('Migrations', 'Could not disconnect. Is mongo down?', err);
    });
  }

  private async migrate(toMigrate: Record<string, IMigrationFile>): Promise<void> {
    let migrationName = '';
    let down: (() => Promise<void>) | undefined;
    const succeeded: string[] = [];

    try {
      await Promise.all(
        Object.entries(toMigrate).map(async ([k, v]) => {
          migrationName = k;
          down = (): Promise<void> => v.down();
          const result = await v.up();

          Log.log('Migration', `${k} finished. Changed ${result.upsertedCount} entries`);
          succeeded.push(k);
        }),
      );
      await this.saveChanges(succeeded);
    } catch (err) {
      Log.error('Migrations', `Could not migrate ${migrationName}`);
      if (down) {
        Log.log('Migration', 'Migrating down');
        await down();
      } else {
        Log.log('Migration', 'Migrate down does not exist. Is file corrupted?');
      }
    }
  }

  private async saveChanges(changes: string[]): Promise<void> {
    const Model = getModel(this.migrationClient as Connection);
    const newElement = new Model({ changes, dbName: 'Users' });
    await newElement.save();
  }

  private async getLastMigration(): Promise<string[]> {
    const Model = getModel(this.migrationClient as Connection);
    const entry = await Model.find({ dbName: 'Users' });

    return !entry || entry.length === 0 ? [] : (entry[0] as IMigration).changes;
  }
}

const controller = new Migrations();

controller
  .init()
  .then(() => controller.disconnect())
  .catch((err) => {
    Log.error('Migrations', 'Could not migrate', JSON.stringify(err, null, 2));
    controller.disconnect();
  });
