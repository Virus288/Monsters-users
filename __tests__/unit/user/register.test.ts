import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import RegisterDto from '../../../src/modules/user/register/dto';
import { fakeData, generateRandomName } from '../../utils';
import type { IRegisterDto } from '../../../src/modules/user/register/types';

describe('Login', () => {
  const fakeUser = fakeData.users[0] as IRegisterDto;
  const password = 'asdzxc123;21qwdsaxII';
  const register: IRegisterDto = {
    login: generateRandomName(),
    password,
    email: `${generateRandomName()}@test.test`,
  };
  const passwords: string[] = [
    'abc123abc123',
    'abc123ABC123',
    '999999999',
    'abcabcabc',
    '8sad8as8da8sd8sa',
    'asbasb123ASB',
  ];

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(register).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];

          try {
            new RegisterDto(clone);
          } catch (err) {
            expect(err).toEqual(new errors.MissingArgError(k));
          }
        });
      });
    });

    describe('Incorrect data', () => {
      it('Register incorrect', () => {
        const clone = structuredClone(fakeUser);
        clone.login = '!@#$%^&*&*()_+P{:"<?a';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(
            new errors.IncorrectArgTypeError(
              'login should only contain arabic letters, numbers and special characters',
            ),
          );
        }
      });

      it('Login too short', () => {
        const clone = structuredClone(fakeUser);
        clone.login = 'a';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        }
      });

      it('Login too long', () => {
        const clone = structuredClone(fakeUser);
        clone.login =
          'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        }
      });

      passwords.forEach((p) => {
        it('Password incorrect', () => {
          const clone = structuredClone(fakeUser);
          clone.password = p;

          try {
            new RegisterDto(clone);
          } catch (err) {
            expect(err).toEqual(
              new errors.IncorrectArgTypeError(
                'password should contain min. 8 characters with at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
              ),
            );
          }
        });
      });

      it('Password too short', () => {
        const clone = structuredClone(fakeUser);
        clone.password = 'a';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
        }
      });

      it('Password too long', () => {
        const clone = structuredClone(fakeUser);
        clone.password =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
        }
      });

      it('Email incorrect', () => {
        const clone = structuredClone(fakeUser);
        clone.email = 'a';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('email invalid'));
        }
      });

      it('Email too long', () => {
        const clone = structuredClone(fakeUser);
        clone.email =
          'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad@aa.aa';

        try {
          new RegisterDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('email', undefined, 200));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Validated register', () => {
      try {
        const data = new RegisterDto(register);
        expect(data.email).toEqual(register.email);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
