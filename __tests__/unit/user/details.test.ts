import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import UserDetailsDto from '../../../src/modules/user/get/dto';
import * as utils from '../../utils';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IUserDetailsDto } from '../../../src/modules/user/get/types';

describe('Details', () => {
  const fakeUser = utils.fakeData.users[0] as IUserEntity;
  const details: IUserDetailsDto = {
    id: fakeUser._id,
    name: fakeUser.login,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing data', () => {
        const clone = structuredClone(details);
        delete clone.name;
        delete clone.id;

        try {
          new UserDetailsDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('id'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Id not proper id', () => {
        const clone = structuredClone(details);
        clone.id = 'aa';

        try {
          new UserDetailsDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        }
      });

      it('Name is not typeof string', () => {
        const clone = structuredClone(details);
        clone.name = 2 as unknown as string;

        try {
          new UserDetailsDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('name should be a string'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Get user details', () => {
      try {
        const data = new UserDetailsDto(details);
        expect(data.name).toEqual(details.name);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
