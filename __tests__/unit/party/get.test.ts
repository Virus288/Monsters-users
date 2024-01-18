import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import GetPartyDto from '../../../src/modules/party/get/dto';
import * as utils from '../../utils';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IGetPartyDto } from '../../../src/modules/party/get/types';

describe('Party - get', () => {
  const fakeParty = utils.fakeData.parties[0] as IPartyEntity;
  const get: IGetPartyDto = {
    id: fakeParty._id,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing id', () => {
        const clone = structuredClone(get);
        clone.id = undefined!;

        try {
          new GetPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('id'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect id', () => {
        const clone = structuredClone(get);
        clone.id = 'asd';

        try {
          new GetPartyDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('id should be objectId'));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', () => {
      try {
        const data = new GetPartyDto(get);
        expect(data.id).toEqual(get.id);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
