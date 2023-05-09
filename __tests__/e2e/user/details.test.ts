import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/controller';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IUserDetailsDto } from '../../../src/modules/user/dto';
import { Connection, fakeData, FakeFactory } from '../../utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Get details', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const details: IUserDetailsDto = {
    id: fakeUser._id,
    name: fakeUser.login,
  };
  const controller = new Controller();
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
    describe('Missing data', () => {
      it('Missing data', () => {
        const clone = structuredClone(details);
        delete clone.name;
        delete clone.id;
        controller.getDetails(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Id not proper id', () => {
        const clone = structuredClone(details);
        clone.id = 'aa';
        controller.getDetails(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Provided user id is invalid'));
        });
      });

      it('Name is not typeof string', () => {
        const clone = structuredClone(details);
        clone.name = 2 as unknown as string;
        controller.getDetails(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('Name is not string'));
        });
      });

      it('User with provided id does not exist', () => {
        const clone = structuredClone(details);
        clone.name = 'a';
        controller.getDetails(clone).catch((err) => {
          expect(err).toEqual(new errors.UserDoesNotExist());
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Should pass', async () => {
      await db.user
        ._id(fakeUser._id)
        .login(fakeUser.login)
        .password(fakeUser.password)
        .email(fakeUser.email)
        .verified(fakeUser.verified)
        .create();

      const user = await controller.getDetails(details);
      expect(user?._id.toString()).toEqual(fakeUser._id);
    });
  });
});
