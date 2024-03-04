import mongoose from 'mongoose';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger';
import type { Connection, ConnectOptions } from 'mongoose';

export default class MongoConnection {
  private _migrationClient: Connection | undefined;

  private get migrationClient(): Connection | undefined {
    return this._migrationClient;
  }

  private set migrationClient(value: Connection | undefined) {
    this._migrationClient = value;
  }

  async init(): Promise<Connection> {
    await this.startServer();
    return this.createMigrationClient();
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    if (this.migrationClient) await this.migrationClient.close();
  }

  private async startServer(): Promise<void> {
    await mongoose.connect(getConfig().mongoURI, {
      dbName: 'Users',
    } as ConnectOptions);
    Log.log('Mongo', 'Started server');
  }

  private createMigrationClient(): Connection {
    return mongoose.createConnection(getConfig().mongoURI, {
      dbName: 'Migrations',
    } as ConnectOptions);
  }
}
