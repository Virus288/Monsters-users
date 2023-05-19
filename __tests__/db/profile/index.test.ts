import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import { EUserRace } from '../../../src/enums';
import Rooster from '../../../src/modules/profile/rooster';
import { fakeData } from '../../utils';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IRegisterDto } from '../../../src/modules/user/dto';

describe('Profile', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as IRegisterDto;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    it('No data in database', async () => {
      const rooster = new Rooster();
      const profile = await rooster.get(new mongoose.Types.ObjectId().toString());

      expect(profile).toEqual(null);
    });

    it('Incorrect target', async () => {
      const userId = await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email(loginData.email)
        .verified(false)
        .create();

      await db.profile
        .user(userId.toString())
        .race(EUserRace.Human)
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      const rooster = new Rooster();
      const profile = await rooster.get(new mongoose.Types.ObjectId().toString());
      expect(profile).toEqual(null);
    });
  });

  describe('Should pass', () => {
    it('Validated', async () => {
      const userId = await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email(loginData.email)
        .verified(false)
        .create();
      await db.profile
        .user(userId.toString())
        .race(EUserRace.Human)
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      const rooster = new Rooster();
      const profile = await rooster.get(userId.toString());
      const { race, user, friends, lvl, exp } = profile!;

      expect(race).toEqual(enums.EUserRace.Human);
      expect(user).toEqual(userId);
      expect(friends.length).toEqual(0);
      expect(lvl).toEqual(1);
      expect(exp[0]).toEqual(0);
    });
  });
});
