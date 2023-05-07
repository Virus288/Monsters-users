import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/user/validation';
import * as errors from '../../../src/errors';
import fakeData from '../../utils/fakeData.json';
import type { IUserDetailsDto } from '../../../src/modules/user/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Details', () => {
  const fakeUser = fakeData.users[0] as IUserEntity;
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
        const func = (): void => Validation.validateGetDetails(clone);

        expect(func).toThrow(new errors.MissingArgError('id'));
      });
    });

    describe('Incorrect data', () => {
      it('Id not proper id', () => {
        const clone = structuredClone(details);
        clone.id = 'aa';
        const func = (): void => Validation.validateGetDetails(clone);

        expect(func).toThrow(new errors.IncorrectArgError('Provided user id is invalid'));
      });

      it('Name is not typeof string', () => {
        const clone = structuredClone(details);
        clone.name = 2 as unknown as string;
        const func = (): void => Validation.validateGetDetails(clone);

        expect(func).toThrow(new errors.IncorrectArgTypeError('Name is not string'));
      });
    });
  });

  describe('Should pass', () => {
    it('Get user details', () => {
      const func = (): void => Validation.validateGetDetails(details);
      expect(func).not.toThrow();
    });
  });
});
