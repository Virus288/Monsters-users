import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import Rooster from '../../../src/modules/user/rooster';
import ProfileRooster from '../../../src/modules/profile/rooster';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { fakeData, FakeFactory } from '../../utils';
import type { IRemoveUserDto } from '../../../src/modules/user/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import * as errors from '../../../src/errors';

describe('Remove user', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };

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
      const user = await rooster.getByLogin(remove.name);

      expect(user).toEqual(null);
    });

    it('Removing not yours account', async () => {
      await db.user
        ._id(fakeUser._id)
        .login(fakeUser.login)
        .password(fakeUser.password)
        .email(fakeUser.email)
        .verified(fakeUser.verified)
        .create();
      await db.profile
        ._id(fakeProfile._id)
        .user(fakeProfile.user)
        .lvl(fakeProfile.lvl)
        .exp(fakeProfile.exp)
        .race(fakeProfile.race)
        .friends(fakeProfile.friends)
        .create();
      const rooster = new Rooster();
      const profileRooster = new ProfileRooster();

      const user = await rooster.getById(fakeUser._id);
      const profile = await profileRooster.getById(fakeProfile._id);
      expect(user?._id.toString()).toEqual(fakeUser._id);
      expect(profile?._id.toString()).toEqual(fakeProfile._id);

      try {
        await rooster.remove(fakeUser2._id);
      } catch (err) {
        expect(err).toEqual(new errors.NoPermission());
      }

      const user2 = await rooster.getById(fakeUser._id);
      const profile2 = await profileRooster.getById(fakeProfile._id);
      expect(user2?._id.toString()).toEqual(fakeUser._id);
      expect(profile2?._id.toString()).toEqual(fakeProfile._id);
    });
  });

  describe('Should pass', () => {
    it('Removed', async () => {
      await db.user
        ._id(fakeUser._id)
        .login(fakeUser.login)
        .password(fakeUser.password)
        .email(fakeUser.email)
        .verified(fakeUser.verified)
        .create();
      await db.profile
        ._id(fakeProfile._id)
        .user(fakeProfile.user)
        .lvl(fakeProfile.lvl)
        .exp(fakeProfile.exp)
        .race(fakeProfile.race)
        .friends(fakeProfile.friends)
        .create();
      const rooster = new Rooster();
      const profileRooster = new ProfileRooster();

      const user = await rooster.getById(fakeUser._id);
      const profile = await profileRooster.getById(fakeProfile._id);
      expect(user?._id.toString()).toEqual(fakeUser._id);
      expect(profile?._id.toString()).toEqual(fakeProfile._id);

      await rooster.remove(fakeUser._id);

      const user2 = await rooster.getById(fakeUser._id);
      const profile2 = await profileRooster.getById(fakeProfile._id);
      expect(user2?._id).toEqual(undefined);
      expect(profile2?._id).toEqual(undefined);
    });
  });
});
