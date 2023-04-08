import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/profile/validation';
import * as errors from '../../../src/errors';
import * as enums from '../../../src/enums';
import mongoose from 'mongoose';
import type { IAddProfileDto, IGetProfileDto } from '../../../src/modules/profile/dto';

describe('Profile', () => {
  const race: IAddProfileDto = {
    race: enums.EUserRace.Elf,
    user: '2',
  };
  const userId: IGetProfileDto = {
    id: new mongoose.Types.ObjectId().toString(),
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing race', () => {
        const clone = structuredClone(race);
        clone.race = undefined!;
        const func = (): void => Validation.validateAddProfile(clone);

        expect(func).toThrow(new errors.MissingArgError('race'));
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        clone.id = undefined!;
        const func = (): void => Validation.validateUserId(clone);

        expect(func).toThrow(new errors.MissingArgError('id'));
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect race', () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;
        const func = (): void => Validation.validateAddProfile(clone);

        expect(func).toThrow(new errors.IncorrectArgError('Race has incorrect type'));
      });
      it('Incorrect userId', () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';
        const func = (): void => Validation.validateUserId(clone);
        expect(func).toThrow(new errors.IncorrectArgTypeError('Provided user id is invalid'));
      });
    });
  });

  describe('Should pass', () => {
    it('Validated race', () => {
      const func = (): void => Validation.validateAddProfile(race);
      expect(func).not.toThrow();
    });
    it('Validated userId', () => {
      const func = (): void => Validation.validateUserId(userId);
      expect(func).not.toThrow();
    });
  });
});
