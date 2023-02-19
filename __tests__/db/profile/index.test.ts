import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Database from '../../utils/mockDB';
import Rooster from '../../../src/modules/profile/rooster';
import * as enums from '../../../src/enums';
import * as types from '../../../src/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fakeData from '../../utils/fakeData.json';

describe('Profile', () => {
  const loginData: types.IRegisterReq = fakeData.users[0];

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
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
      const db = new Database();
      const userId = await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email(loginData.email)
        .verified(false)
        .create();
      await db.profile.user(userId.toString()).create();

      const rooster = new Rooster();
      const profile = await rooster.get(new mongoose.Types.ObjectId().toString());
      await db.cleanUp();

      expect(profile).toEqual(null);
    });
  });

  describe('Should pass', () => {
    it(`Validated`, async () => {
      const db = new Database();
      const userId = await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email(loginData.email)
        .verified(false)
        .create();
      await db.profile.user(userId.toString()).create();

      const rooster = new Rooster();
      const profile = await rooster.get(userId.toString());
      const { race, user, friends, lvl, exp } = profile;
      await db.cleanUp();

      expect(race).toEqual(enums.EUserRace.Human);
      expect(user).toEqual(userId);
      expect(friends.length).toEqual(0);
      expect(lvl).toEqual(1);
      expect(exp[0]).toEqual(1);
    });
  });
});
