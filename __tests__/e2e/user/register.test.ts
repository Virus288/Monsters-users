import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import type { IFullError } from '../../../src/types';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/controller';
import type { IRegisterDto } from '../../../src/modules/user/dto';
import { Connection, fakeData, FakeFactory } from '../../utils';

describe('Register', () => {
  const connection = new Connection();
  const db = new FakeFactory();
  const registerData = fakeData.users[1] as IRegisterDto;
  const controller = new Controller();

  beforeAll(() => {
    connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(() => {
    connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing login', () => {
        const clone = structuredClone(registerData);
        clone.login = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('login'));
        });
      });

      it('Missing password', () => {
        const clone = structuredClone(registerData);
        clone.password = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('password'));
        });
      });

      it('Missing email', () => {
        const clone = structuredClone(registerData);
        clone.email = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('email'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Already registered', async () => {
        await db.user
          .login(registerData.login)
          .password(registerData.password)
          .email(registerData.email)
          .verified(false)
          .create();

        try {
          await controller.register(registerData);
        } catch (err) {
          expect(err).toEqual(new errors.UsernameAlreadyInUseError());
        }
      });

      it('Login incorrect', () => {
        controller
          .register({
            ...registerData,
            login: '!@#$%^&*&*()_+P{:"<?a',
            email: 'email@email.email',
          })
          .catch((err) => {
            expect(err).toEqual(
              new errors.IncorrectArgTypeError(
                'login should only contain arabic letters, numbers and special characters',
              ),
            );
          });
      });

      it('Login too short', () => {
        controller.register({ ...registerData, login: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
        });
      });

      it('Login too long', () => {
        controller
          .register({
            ...registerData,
            login:
              'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
          })
          .catch((err) => {
            expect(err).toEqual(new errors.IncorrectArgLengthError('login', 3, 30));
          });
      });

      it('Password incorrect', () => {
        controller.register({ ...registerData, password: 'a@$QEWASD+)}KO_PL{:">?' }).catch((err) => {
          expect(err).toEqual(
            new errors.IncorrectArgTypeError(
              'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
            ),
          );
        });
      });

      it('Password too short', () => {
        controller.register({ ...registerData, password: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
        });
      });

      it('Password too long', () => {
        controller
          .register({
            ...registerData,
            password:
              'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad',
          })
          .catch((err) => {
            expect(err).toEqual(new errors.IncorrectArgLengthError('password', 6, 200));
          });
      });

      it('Email incorrect', () => {
        controller.register({ ...registerData, email: 'a' }).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Not valid email address'));
        });
      });

      it('Email incorrect', () => {
        controller
          .register({
            ...registerData,
            email:
              'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad@aa.aa',
          })
          .catch((err) => {
            expect(err).toEqual(new errors.IncorrectArgLengthError('email', undefined, 200));
          });
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', () => {
      controller.register({ ...registerData, email: 'test22@test.test' }).catch((err) => {
        const error = err as IFullError;
        // #TODO Add proper test
        expect(error.name).toEqual('MongoNotConnectedError');
      });
    });
  });
});
