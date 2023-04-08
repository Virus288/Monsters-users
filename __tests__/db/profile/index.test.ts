import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import Rooster from '../../../src/modules/profile/rooster';
import * as enums from '../../../src/enums';
import { EUserRace } from '../../../src/enums';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IRegisterDto } from '../../../src/modules/user/dto';

describe('Profile', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as IRegisterDto;

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
      await db.profile.user(userId.toString()).race(EUserRace.Human).create();

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
      await db.profile.user(userId.toString()).race(EUserRace.Human).create();

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
