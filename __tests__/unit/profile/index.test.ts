import { describe, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import * as errors from '../../../src/errors';
import AddProfileDto from '../../../src/modules/profile/add/dto';
import GetProfileDto from '../../../src/modules/profile/get/dto';
import type { IAddProfileDto } from '../../../src/modules/profile/add/types';
import type { IGetProfileDto } from '../../../src/modules/profile/get/types';

describe('Profile', () => {
  const race: IAddProfileDto = {
    race: enums.EUserRace.Elf,
  };
  const userId: IGetProfileDto = {
    id: new mongoose.Types.ObjectId().toString(),
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing race', () => {
        const clone = structuredClone(race);
        clone.race = undefined!;

        try {
          new AddProfileDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('race'));
        }
      });

      it('Missing userId', () => {
        const clone = structuredClone(userId);
        clone.id = undefined!;

        try {
          new GetProfileDto(clone);
          1;
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('id'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect race', () => {
        const clone = structuredClone(race);
        clone.race = 'test' as enums.EUserRace;

        try {
          new AddProfileDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('race has incorrect type'));
        }
      });

      it('Incorrect userId', () => {
        const clone = structuredClone(userId);
        clone.id = 'asd';

        try {
          new GetProfileDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Validated race', () => {
      const data = new AddProfileDto(race);
      expect(data.race).toEqual(race.race);
    });

    it('Validated userId', () => {
      const data = new GetProfileDto(userId);
      expect(data.id).toEqual(userId.id);
    });
  });
});
