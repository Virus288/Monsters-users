import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/login';
import { fakeData, FakeFactory } from '../../utils';
import type { ILoginDto } from '../../../src/modules/user/login/types';

describe('Login', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as ILoginDto;
  const controller = new Controller();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing login', () => {
        const clone = structuredClone(loginData);
        clone.login = undefined!;
        controller.login(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('login'));
        });
      });

      it('Missing password', () => {
        const clone = structuredClone(loginData);
        clone.password = undefined!;
        controller.login(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('password'));
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
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        });
      });

      it('Password incorrect', () => {
        controller.login({ ...loginData, password: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
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
