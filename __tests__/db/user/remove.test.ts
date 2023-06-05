import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import ProfileRooster from '../../../src/modules/profile/rooster';
import Rooster from '../../../src/modules/user/rooster';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IRemoveUserDto } from '../../../src/modules/user/remove/types';

describe('Remove user', () => {
  const connection = new Connection();
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };

  beforeAll(async () => {
    await connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await connection.close();
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
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      const rooster = new Rooster();
      const profileRooster = new ProfileRooster();

      const user = await rooster.get(fakeUser._id);
      const profile = await profileRooster.get(fakeProfile._id);
      expect(user?._id.toString()).toEqual(fakeUser._id);
      expect(profile?._id.toString()).toEqual(fakeProfile._id);

      try {
        await rooster.remove(fakeUser2._id);
      } catch (err) {
        expect(err).toEqual(new errors.NoPermission());
      }

      const user2 = await rooster.get(fakeUser._id);
      const profile2 = await profileRooster.get(fakeProfile._id);
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
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();
      const rooster = new Rooster();
      const profileRooster = new ProfileRooster();

      const user = await rooster.get(fakeUser._id);
      const profile = await profileRooster.get(fakeProfile._id);
      expect(user?._id.toString()).toEqual(fakeUser._id);
      expect(profile?._id.toString()).toEqual(fakeProfile._id);

      await rooster.remove(fakeUser._id);

      const user2 = await rooster.get(fakeUser._id);
      expect(user2?._id).toEqual(undefined);
    });
  });
});
