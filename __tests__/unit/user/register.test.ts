import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import type { IRegisterDto } from '../../../src/modules/user/dto';
import { fakeData, generateRandomName } from '../../utils';

describe('Login', () => {
  const fakeUser = fakeData.users[0] as IRegisterDto;
  const password = `${generateRandomName()}123`;
  const register: IRegisterDto = {
    login: generateRandomName(),
    password,
    email: `${generateRandomName()}@test.test`,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(register).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];
          const func = (): void => Validation.validateRegister(clone);
          expect(func).toThrow(new errors.IncorrectArgError(`${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Register incorrect', () => {
        const clone = structuredClone(fakeUser);
        clone.login = '!@#$%^&*&*()_+P{:"<?a';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(
          new errors.IncorrectArgTypeError('login should only contain arabic letters, numbers and special characters'),
        );
      });

      it('Login too short', () => {
        const clone = structuredClone(fakeUser);
        clone.login = 'a';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('login', 3, 30));
      });

      it('Login too long', () => {
        const clone = structuredClone(fakeUser);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('login', 3, 30));
      });

      it('Password incorrect', () => {
        const clone = structuredClone(fakeUser);
        clone.password = 'a@$QEWASD+)}KO_PL{:">?';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(
          new errors.IncorrectArgTypeError(
            'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
          ),
        );
      });

      it('Password too short', () => {
        const clone = structuredClone(fakeUser);
        clone.password = 'a';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('password', 6, 200));
      });

      it('Password too long', () => {
        const clone = structuredClone(fakeUser);
        clone.password =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('password', 6, 200));
      });

      it('Email incorrect', () => {
        const clone = structuredClone(fakeUser);
        clone.email = 'a';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Not valid email address'));
      });

      it('Email too long', () => {
        const clone = structuredClone(fakeUser);
        clone.email =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad@aa.aa';
        const func = (): void => Validation.validateRegister(clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('email', undefined, 200));
      });
    });
  });

  describe('Should pass', () => {
    it('Validated register', () => {
      const func = (): void => Validation.validateRegister(register);
      expect(func).not.toThrow();
    });
  });
});
