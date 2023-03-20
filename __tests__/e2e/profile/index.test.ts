import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import * as types from '../../../src/types';
import * as enums from '../../../src/enums';
import Controller from '../../../src/modules/profile/controller';
import fakeData from '../../utils/fakeData.json';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import FakeFactory from '../../utils/fakeFactory/src';

describe('Profile', () => {
  const db = new FakeFactory();
  const id = fakeData.users[0]._id;
  const race: types.INewProfileReq = {
    race: enums.EUserRace.Elf,
  };
  const fake = fakeData.profiles[1];
  const userId: types.IUserId = {
    id,
  };
  const localUser: types.ILocalUser = {
    userId: undefined,
    tempId: 'tempId',
    validated: true,
    type: enums.EUserTypes.User,
  };
  const localUser2: types.ILocalUser = {
    userId: new mongoose.Types.ObjectId().toString(),
    tempId: 'tempId',
    validated: true,
    type: enums.EUserTypes.User,
  };
  const localUser3: types.ILocalUser = {
    userId: new mongoose.Types.ObjectId().toString(),
    tempId: 'tempId',
    validated: true,
    type: enums.EUserTypes.User,
  };
  const controller = new Controller();

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
    describe('No data passed', () => {
      it(`Missing race`, () => {
        const clone = structuredClone(race);
        delete clone.race;

        controller.addProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectProfile('2', `Race is missing`));
        });
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        delete clone.id;

        controller.getProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentials('2', 'Provided user id is missing'));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect race`, () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;

        controller.addProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectProfile('2', 'Race has incorrect type'));
        });
      });

      it('Incorrect userId', () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';

        controller.getProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentials('2', 'Provided user id is invalid'));
        });
      });

      it(`Profile already exists`, async () => {
        await db.profile.user(localUser2.userId).race(race.race).create();

        try {
          await controller.addProfile(race, localUser2);
        } catch (err) {
          expect(err).not.toBeUndefined();
        }
      });

      it(`Profile does not exist`, async () => {
        const profile = await controller.getProfile(userId, localUser);
        expect(profile).toBeNull();
      });
    });
  });

  describe('Should pass', () => {
    it(`Added profile`, async () => {
      db.profile.user(localUser2.userId);

      const func = async () => await controller.addProfile(race, localUser2);
      expect(func).not.toThrow();
    });

    it(`Got profile`, async () => {
      await db.profile
        .user(localUser3.userId)
        .race(fake.race as enums.EUserRace)
        .lvl(fake.lvl)
        .exp(fake.exp as [number, number])
        .friends(fake.friends)
        .create();

      const profile = await controller.getProfile({ id: localUser3.userId }, localUser3);
      console.log('profile');
      console.log(profile);

      expect(profile.user.toString()).toEqual(localUser3.userId);
      expect(profile.lvl).toEqual(fakeData.profiles[1].lvl);
      expect(profile.race).toEqual(fakeData.profiles[1].race);
      expect(profile.friends).toEqual(fakeData.profiles[1].friends);
    });
  });
});
