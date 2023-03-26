import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import { ILoginDto } from '../../../src/modules/user/dto';

describe('Login', () => {
  const login: ILoginDto = {
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

          expect(func).toThrow(new errors.IncorrectArgError('2', `${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Login too short`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = 'bc';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'login', 3, 30));
      });

      it(`Login too long`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'login', 3, 30));
      });

      it(`Incorrect password`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'abc';
        const func = () => Validation.validateLogin('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'password', 6, 200));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, () => {
      const func = () => Validation.validateLogin('2', login);
      expect(func).not.toThrow();
    });
  });
});
