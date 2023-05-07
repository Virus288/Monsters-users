import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import type { IRemoveUserDto } from '../../../src/modules/user/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Remove', () => {
  const fakeUser = fakeData.users[0] as IUserEntity;
  const remove: IRemoveUserDto = {
    name: fakeUser.login,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(remove).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(remove);
          delete clone[k];
          const func = (): void => Validation.validateRemove(clone);

          expect(func).toThrow(new errors.MissingArgError(k));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Name is not string', () => {
        const clone = structuredClone(remove);
        clone.name = 1 as unknown as string;
        const func = (): void => Validation.validateRemove(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Name is not string'));
      });
    });
  });

  describe('Should pass', () => {
    it('Remove user', () => {
      const func = (): void => Validation.validateRemove(remove);
      expect(func).not.toThrow();
    });
  });
});
