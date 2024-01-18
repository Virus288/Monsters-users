import { afterEach, describe, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import * as errors from '../../../src/errors';
import AddController from '../../../src/modules/profile/add';
import GetController from '../../../src/modules/profile/get';
import * as utils from '../../utils';
import { fakeData } from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IAddProfileDto } from '../../../src/modules/profile/add/types';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IGetProfileDto } from '../../../src/modules/profile/get/types';
import type * as types from '../../../src/types';

describe('Profile', () => {
  const db = new utils.FakeFactory();
  const id = utils.fakeData.users[0]!._id;
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
  const addController = new AddController();
  const getController = new GetController();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing race', () => {
        const clone = structuredClone(race);
        clone.race = undefined!;

        addController.add(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('race'));
        });
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        clone.id = undefined!;

        getController.get(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect race', () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;

        addController.add(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('race has incorrect type'));
        });
      });

      it('Incorrect userId', () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';

        getController.get(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        });
      });

      it('Profile already exists', async () => {
        await db.profile.user(localUser2.userId).race(race.race).inventory(fakeInv._id).party(fakeParty._id).create();

        try {
          await addController.add(race, localUser2);
        } catch (err) {
          expect(err).not.toBeUndefined();
        }
      });

      it('Profile does not exist', async () => {
        const profile = await getController.get(userId);
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

      const profile = (await getController.get({ id: localUser3.userId! }))!;

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

      const func = async (): Promise<void> => addController.add(race, localUser2);

      expect(func).not.toThrow();
    });
  });
});
