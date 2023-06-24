import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { fakeData, FakeFactory } from '../../../__tests__/utils';
import { EFakeData } from '../../../__tests__/utils/fakeFactory/enums';
import Log from '../logger/log';
import type { IFakeState } from '../../../__tests__/utils/fakeFactory/types/data';
import type { IInventoryEntity } from '../../modules/inventory/entity';
import type { IPartyEntity } from '../../modules/party/entity';
import type { IProfileEntity } from '../../modules/profile/entity';
import type { IUserEntity } from '../../modules/user/entity';

export default class Mock {
  private readonly _fakeFactory: FakeFactory | undefined = undefined;

  constructor() {
    this._fakeFactory = new FakeFactory();
  }

  private get fakeFactory(): FakeFactory {
    return this._fakeFactory!;
  }

  async init(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());

    await this.fulfillDatabase();
    Log.log('Mongo', 'Started mock server');
  }

  private async fulfillDatabase(): Promise<void> {
    const users = fakeData.users as IUserEntity[];
    const profiles = fakeData.profiles as IProfileEntity[];
    const inventories = fakeData.inventories as IInventoryEntity[];
    const parties = fakeData.parties as IPartyEntity[];

    await this.fillData(EFakeData.User, users);
    await this.fillData(EFakeData.Inventory, inventories);
    await this.fillData(EFakeData.Party, parties);

    await Promise.all(
      profiles.map(async (p) => {
        const db = new FakeFactory();
        const party = parties.find((e) => e._id === p.party)!;
        const inventory = inventories.find((e) => e._id === p.inventory)!;

        return db.profile.user(p.user).race(p.race).party(party._id).inventory(inventory._id).create();
      }),
    );
  }

  private async fillData<T extends EFakeData>(type: T, params: IFakeState[T][]): Promise<void> {
    const target = this.fakeFactory[type];

    await Promise.all(
      params.map(async (p) => {
        for (const m of Object.getOwnPropertyNames(Object.getPrototypeOf(target))) {
          if (m === 'constructor' || m === 'create' || m === 'fillState' || typeof target[m] !== 'function') continue;

          const method = target[m] as (arg: unknown) => void;
          method.call(target, p[m]);
        }
        await target.create();
      }),
    );
  }
}
