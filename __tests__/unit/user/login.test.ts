import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import type { ILoginDto, IRegisterDto } from '../../../src/modules/user/dto';

describe('Login', () => {
  const fakeUser = fakeData.users[0] as IRegisterDto;
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
          const func = (): void => Validation.validateLogin(clone);

          expect(func).toThrow(new errors.IncorrectArgError(`${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Login too short', () => {
        const clone = structuredClone(fakeUser);
        clone.login = 'bc';
        const func = (): void => Validation.validateLogin(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('login', 3, 30));
      });

      it('Login too long', () => {
        const clone = structuredClone(fakeUser);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = (): void => Validation.validateLogin(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('login', 3, 30));
      });

      it('Incorrect password', () => {
        const clone = structuredClone(fakeUser);
        clone.password = 'abc';
        const func = (): void => Validation.validateLogin(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('password', 6, 200));
      });
    });
  });

  describe('Should pass', () => {
    it('Validated login', () => {
      const func = (): void => Validation.validateLogin(login);
      expect(func).not.toThrow();
    });
  });
});
