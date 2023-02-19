import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/modules/profile/validation';
import * as errors from '../../../src/errors';
import * as types from '../../../src/types';
import * as enums from '../../../src/enums';
import mongoose from 'mongoose';

describe('Profile', () => {
  const race: types.INewProfile = {
    race: enums.EUserRace.Elf,
    user: 'randomUser',
  };
  const userId: types.IUserId = {
    id: new mongoose.Types.ObjectId().toString(),
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing race', () => {
        const clone = structuredClone(race);
        delete clone.race;
        const func = () => Validation.validateAddProfile('2', clone);

        expect(func).toThrow(new errors.IncorrectProfile('2', `Race is missing`));
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        delete clone.id;
        const func = () => Validation.validateUserId('2', clone);

        expect(func).toThrow(new errors.IncorrectCredentials('2', 'Provided user id is missing'));
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect race`, () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;
        const func = () => Validation.validateAddProfile('2', clone);

        expect(func).toThrow(new errors.IncorrectProfile('2', 'Race has incorrect type'));
      });
      it(`Incorrect userId`, () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';
        const func = () => Validation.validateUserId('2', clone);
        expect(func).toThrow(new errors.IncorrectCredentials('2', 'Provided user id is invalid'));
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated race`, () => {
      const func = () => Validation.validateAddProfile('2', race);
      expect(func).not.toThrow();
    });
    it(`Validated userId`, () => {
      const func = () => Validation.validateUserId('2', userId);
      expect(func).not.toThrow();
    });
  });
});
