import { describe, expect, it } from '@jest/globals';
import * as types from '../../src/types';
import Validation from '../../src/validation';
import * as errors from '../../src/errors';
import { generateRandomName } from '../../src/utils';
import fakeData from '../utils/fakeData.json';

describe('Login', () => {
  const password = `${generateRandomName()}123`;
  const register: types.IRegisterReq = {
    login: generateRandomName(),
    password: password,
    password2: password,
    email: `${generateRandomName()}@test.test`,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(register).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];
          const func = () => Validation.validateRegister('2', clone);

          expect(func).toThrow(new errors.IncorrectCredentials('2', `${k} missing`));
        });
      });
    });

    describe('Incorrect data', () => {
      it(`Register incorrect`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = '!@#$%^&*&*()_+P{:"<?a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(
          new errors.IncorrectCredentials(
            '2',
            `login should only contain arabic letters, numbers and special characters`,
          ),
        );
      });

      it(`Login too short`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `login should be at least 3 characters`));
      });

      it(`Login too long`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `login should be less than 30 characters`));
      });

      it(`Password incorrect`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'a@$QEWASD+)}KO_PL{:">?';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(
          new errors.IncorrectCredentials(
            '2',
            `password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter`,
          ),
        );
      });

      it(`Password too short`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `password should be at least 6 characters long`));
      });

      it(`Password too long`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `password should be less than 200 characters`));
      });

      it(`Passwords do not match`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.password2 = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `Passwords not the same`));
      });

      it(`Email incorrect`, async () => {
        const clone = structuredClone(fakeData.users[0]);
        clone.email = 'a';
        const func = () => Validation.validateRegister('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', `Not valid email address`));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated register`, async () => {
      const func = () => Validation.validateRegister('2', register);
      expect(func).not.toThrow();
    });
  });
});
