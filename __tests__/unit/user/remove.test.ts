import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import RemoveUserDto from '../../../src/modules/user/remove/dto';
import * as utils from '../../utils';
import type { IUserEntity } from '../../../src/modules/user/entity';
import type { IRemoveUserDto } from '../../../src/modules/user/remove/types';

describe('Remove', () => {
  const fakeUser = utils.fakeData.users[0] as IUserEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(remove).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(remove);
          delete clone[k];

          try {
            new RemoveUserDto(clone);
          } catch (err) {
            expect(err).toEqual(new errors.MissingArgError(k));
          }
        });
      });
    });

    describe('Incorrect data', () => {
      it('Name is not string', () => {
        const clone = structuredClone(remove);
        clone.name = 1 as unknown as string;

        try {
          new RemoveUserDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('name should be a string'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Remove user', () => {
      try {
        const data = new RemoveUserDto(remove);
        expect(data.name).toEqual(remove.name);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
