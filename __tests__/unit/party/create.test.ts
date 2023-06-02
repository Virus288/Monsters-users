import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import AddPartyDto from '../../../src/modules/party/add/dto';
import { fakeData } from '../../utils';
import type { IAddPartyDto } from '../../../src/modules/party/add/types';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Party - create', () => {
  const fakeUser = fakeData.users[0] as IUserEntity;
  const create: IAddPartyDto = {
    leader: fakeUser._id,
    characters: [],
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing leader', () => {
        const clone = structuredClone(create);
        clone.leader = undefined!;

        try {
          new AddPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('leader'));
        }
      });

      it('Missing characters', () => {
        const clone = structuredClone(create);
        clone.characters = undefined!;

        try {
          new AddPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('characters'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect id', () => {
        const clone = structuredClone(create);
        clone.leader = 'asd';

        try {
          new AddPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('leader should be objectId'));
        }
      });

      it('Incorrect characters', () => {
        const clone = structuredClone(create);
        clone.characters = 'asd' as unknown as string[];

        try {
          new AddPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('characters should be array'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', () => {
      try {
        const data = new AddPartyDto(create);
        expect(data.leader).toEqual(create.leader);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
