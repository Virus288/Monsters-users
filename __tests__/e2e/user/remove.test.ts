import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/controller';
import Handler from '../../../src/modules/user/handler';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IRemoveUserDto } from '../../../src/modules/user/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import State from '../../../src/tools/state';
import Connection from '../../utils';

describe('Remove user', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeUser2 = fakeData.users[1] as IUserEntity;
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };
  const controller = new Controller();
  const handler = new Handler();
  const connection = new Connection();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    connection.close();
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
          expect(err).toEqual(new errors.UserDoesNotExist());
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
        .create();

      await handler.remove(remove.name, fakeUser._id);

      const cached = await State.Redis.getRemovedUsers(fakeUser.login);
      expect(cached).toEqual(fakeUser.login);
    });
  });
});
