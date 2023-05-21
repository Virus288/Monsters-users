import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Validation from '../../../src/modules/party/validation';
import { fakeData } from '../../utils';
import type { ICreatePartyDto } from '../../../src/modules/party/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Party - create', () => {
  const fakeUser = fakeData.users[0] as IUserEntity;
  const create: ICreatePartyDto = {
    leader: fakeUser._id,
    characters: [],
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing leader', () => {
        const clone = structuredClone(create);
        clone.leader = undefined!;
        const func = (): void => Validation.validateCreate(clone);

        expect(func).toThrow(new errors.MissingArgError('leader'));
      });

      it('Missing characters', () => {
        const clone = structuredClone(create);
        clone.characters = undefined!;
        const func = (): void => Validation.validateCreate(clone);

        expect(func).toThrow(new errors.MissingArgError('characters'));
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect id', () => {
        const clone = structuredClone(create);
        clone.leader = 'asd';
        const func = (): void => Validation.validateCreate(clone);
        expect(func).toThrow(new errors.IncorrectArgError('Provided Leader id is invalid'));
      });

      it('Incorrect characters', () => {
        const clone = structuredClone(create);
        clone.characters = 'asd' as unknown as string[];
        const func = (): void => Validation.validateCreate(clone);
        expect(func).toThrow(new errors.IncorrectArgError('Provided characters list is invalid'));
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', () => {
      const func = (): void => Validation.validateCreate(create);
      expect(func).not.toThrow();
    });
  });
});
