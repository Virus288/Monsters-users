import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import GetController from '../../../src/modules/user/get';
import Controller from '../../../src/modules/user/register';
import * as utils from '../../utils';
import type { IUserDetailsDto } from '../../../src/modules/user/get/types';
import type { IRegisterDto } from '../../../src/modules/user/register/types';

describe('Register', () => {
  const db = new utils.FakeFactory();
  const registerData = utils.fakeData.users[3] as IRegisterDto;
  const controller = new Controller();
  const details: IUserDetailsDto = {
    name: registerData.login,
  };

  afterEach(async () => {
    await db.cleanUp();
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
              new errors.IncorrectArgTypeError('login should only contain letters, numbers and special characters'),
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
              'password should contain min. 8 characters with at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
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
          expect(err).toEqual(new errors.IncorrectArgTypeError('email invalid'));
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
    it('Validated', async () => {
      const getController = new GetController();

      await controller.register({ ...registerData, email: 'test22@test.test' });
      const [user] = await getController.get([details]);
      expect(user?.login).toEqual(details.name);
    });
  });
});
