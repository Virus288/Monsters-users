import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Handler from '../../../src/modules/user/handler';
import Controller from '../../../src/modules/user/remove/';
import State from '../../../src/tools/state';
import { fakeData, FakeFactory } from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IRemoveUserDto } from '../../../src/modules/user/remove/types';

describe('Remove user', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };
  const controller = new Controller();
  const handler = new Handler();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing id', () => {
        const clone = structuredClone(remove);
        clone.name = undefined!;
        controller.remove(clone.name).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentialsError());
        });
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await db.user
          ._id(fakeUser._id)
          .login(fakeUser.login)
          .password(fakeUser.password)
          .email(fakeUser.email)
          .verified(fakeUser.verified)
          .create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it('No user with provided id', () => {
        handler.remove(fakeUser2.login, fakeUser2._id).catch((err) => {
          expect(err).toEqual(new errors.NoPermission());
        });
      });
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

      await handler.remove(remove.name, fakeUser._id);
      const cached = await State.Redis.getRemovedUsers(fakeUser._id);
      expect(cached).toEqual(fakeUser.login);
    });
  });
});
