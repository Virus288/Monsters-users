import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/controller';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { ILoginDto } from '../../../src/modules/user/dto';

describe('Login', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as ILoginDto;
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
      it('Missing login', () => {
        const clone = structuredClone(loginData);
        clone.login = undefined!;
        controller.login(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentialsError());
        });
      });

      it('Missing password', () => {
        const clone = structuredClone(loginData);
        clone.password = undefined!;
        controller.login(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentialsError());
        });
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await db.user
          .login(loginData.login)
          .password(loginData.password)
          .email('test@test.test')
          .verified(false)
          .create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it('Login incorrect', () => {
        controller.login({ ...loginData, login: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentialsError());
        });
      });

      it('Password incorrect', () => {
        controller.login({ ...loginData, password: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentialsError());
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', async () => {
      await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email('test@test.test')
        .verified(false)
        .create();

      const { userId, refreshToken, accessToken } = await controller.login(loginData);
      expect(userId).not.toBeUndefined();
      expect(userId.length).not.toBeLessThan(10);
      expect(refreshToken).not.toBeUndefined();
      expect(refreshToken.length).not.toBeLessThan(20);
      expect(accessToken).not.toBeUndefined();
      expect(accessToken.length).not.toBeLessThan(20);
    });
  });
});
