import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import { generateRandomName } from '../../../src/utils';
import { IRegisterDto } from '../../../src/modules/user/dto';

describe('Login', () => {
  const password = `${generateRandomName()}123`;
  const register: IRegisterDto = {
    login: generateRandomName(),
    password: password,
    email: `${generateRandomName()}@test.test`,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(register).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];
          const func = () => Validation.validateRegister('2', clone);

          expect(func).toThrow(new errors.IncorrectArgError('2', `${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Register incorrect`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = '!@#$%^&*&*()_+P{:"<?a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(
          new errors.IncorrectArgType('2', `login should only contain arabic letters, numbers and special characters`),
        );
      });

      it(`Login too short`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'login', 3, 30));
      });

      it(`Login too long`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'login', 3, 30));
      });

      it(`Password incorrect`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'a@$QEWASD+)}KO_PL{:">?';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(
          new errors.IncorrectArgType(
            '2',
            `password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter`,
          ),
        );
      });

      it(`Password too short`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'password', 6, 200));
      });

      it(`Password too long`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectArgLengthError('2', 'password', 6, 200));
      });

      it(`Email incorrect`, () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.email = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectArgType('2', `Not valid email address`));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated register`, () => {
      const func = () => Validation.validateRegister('2', register);
      expect(func).not.toThrow();
    });
  });
});
