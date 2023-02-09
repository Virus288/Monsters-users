import { describe, expect, it } from '@jest/globals';
import Validation from '../../src/validation';
import * as errors from '../../src/errors';
import * as types from '../../src/types';
import fakeData from '../utils/fakeData.json';

describe('Login', () => {
  const login: types.ILoginReq = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(login).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];
          const func = () => Validation.validateLogin('2', clone);

          expect(func).toThrow(new errors.IncorrectCredentials('2', `${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Login too short`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = 'bc';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `login should be at least 3 characters`));
      });

      it(`Login too long`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `login should be less than 30 characters`));
      });

      it(`Incorrect password`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'abc';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `password should be at least 6 characters long`));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, async () => {
      const func = () => Validation.validateLogin('2', login);
      expect(func).not.toThrow();
    });
  });
});
