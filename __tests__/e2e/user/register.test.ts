import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import type { IFullError } from '../../../src/types';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/controller';
import fakeData from '../../utils/fakeData.json';
import FakeFactory from '../../utils/fakeFactory/src';
import type { IRegisterDto } from '../../../src/modules/user/dto';

describe('Register', () => {
  const db = new FakeFactory();
  const registerData = fakeData.users[0] as IRegisterDto;
  const controller = new Controller();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing login', () => {
        const clone = structuredClone(registerData);
        clone.login = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('login missing'));
        });
      });

      it('Missing password', () => {
        const clone = structuredClone(registerData);
        clone.password = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('password missing'));
        });
      });

      it('Missing email', () => {
        const clone = structuredClone(registerData);
        clone.email = undefined!;
        controller.register(clone).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('email missing'));
        });
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
        await db.user
          .login(registerData.login)
          .password(registerData.password)
          .email(registerData.email)
          .verified(false)
          .create();
      });

      it('Already registered', () => {
        controller.register(registerData).catch((err) => {
          expect(err).toEqual(new errors.UsernameAlreadyInUseError());
        });
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
              new errors.IncorrectArgType('login should only contain arabic letters, numbers and special characters'),
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
            new errors.IncorrectArgType(
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
        expect(error.name).toEqual('MongoPoolClosedError');
      });
    });
  });
});
