import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/profile/controller';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IAddProfileDto, IGetProfileDto } from '../../../src/modules/profile/dto';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type * as types from '../../../src/types';

describe('Profile', () => {
  const db = new FakeFactory();
  const id = fakeData.users[0]!._id;
  const race: IAddProfileDto = {
    race: enums.EUserRace.Human,
  };
  const fake = fakeData.profiles[1] as IProfileEntity;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const userId: IGetProfileDto = {
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
  const connection = new Connection();

  beforeAll(() => {
    connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(() => {
    connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing race', () => {
        const clone = structuredClone(race);
        clone.race = undefined!;

        controller.addProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('race'));
        });
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        clone.id = undefined!;

        controller.getProfile(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect race', () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;

        controller.addProfile(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Race has incorrect type'));
        });
      });

      it('Incorrect userId', () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';

        controller.getProfile(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Provided user id is invalid'));
        });
      });

      it('Profile already exists', async () => {
        await db.profile.user(localUser2.userId).race(race.race).inventory(fakeInv._id).party(fakeParty._id).create();

        try {
          await controller.addProfile(race, localUser2);
        } catch (err) {
          expect(err).not.toBeUndefined();
        }
      });

      it('Profile does not exist', async () => {
        const profile = await controller.getProfile(userId);
        expect(profile).toBeNull();
      });
    });
  });

  describe('Should pass', () => {
    it('Got profile', async () => {
      await db.profile
        .user(localUser3.userId)
        .race(fake.race)
        .lvl(fake.lvl)
        .exp(fake.exp)
        .friends(fake.friends)
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      const profile = (await controller.getProfile({ id: localUser3.userId! }))!;

      expect(profile.user.toString()).toEqual(localUser3.userId);
      expect(profile.lvl).toEqual(fake.lvl);
      expect(profile.race).toEqual(fake.race);
      expect(profile.friends).toEqual(fake.friends);
    });

    it('Initialized profile', async () => {
      await db.profile
        .user(localUser2.userId)
        .race(fake.race)
        .lvl(fake.lvl)
        .exp(fake.exp)
        .friends(fake.friends)
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      const func = async (): Promise<void> => controller.addProfile(race, localUser2);

      expect(func).not.toThrow();
    });
  });
});
