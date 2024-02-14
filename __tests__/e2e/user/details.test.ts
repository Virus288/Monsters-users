import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/user/get';
import * as utils from '../../utils';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IUserDetailsDto } from '../../../src/modules/user/get/types';

describe('Get details', () => {
  const db = new utils.FakeFactory();
  const fakeUser = utils.fakeData.users[0] as IUserEntity;
  const details: IUserDetailsDto = {
    id: fakeUser._id,
    name: fakeUser.login,
  };
  const controller = new Controller();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it('Missing data', () => {
        const clone = structuredClone(details);
        delete clone.name;
        delete clone.id;
        controller.get([clone]).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Id not proper id', () => {
        const clone = structuredClone(details);
        clone.id = 'aa';
        controller.get([clone]).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        });
      });

      it('Name is not typeof string', () => {
        const clone = structuredClone(details);
        clone.name = 2 as unknown as string;
        controller.get([clone]).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('name should be a string'));
        });
      });

      it('User with provided id does not exist', () => {
        const clone = structuredClone(details);
        clone.name = 'a';
        controller.get([clone]).catch((err) => {
          expect(err).toEqual(new errors.UserDoesNotExist());
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Should pass', async () => {
      await db.user
        ._id(fakeUser._id)
        .login(fakeUser.login)
        .password(fakeUser.password)
        .email(fakeUser.email)
        .verified(fakeUser.verified)
        .create();

      const [user] = await controller.get([details]);
      expect(user?.login).toEqual(fakeUser.login);
    });
  });
});
