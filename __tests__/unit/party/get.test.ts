import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Validation from '../../../src/modules/party/validation';
import { fakeData } from '../../utils';
import type { IGetPartyDto } from '../../../src/modules/party/dto';
import type { IPartyEntity } from '../../../src/modules/party/entity';

describe('Party - get', () => {
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const get: IGetPartyDto = {
    id: fakeParty._id,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing id', () => {
        const clone = structuredClone(get);
        clone.id = undefined!;
        const func = (): void => Validation.validateGet(clone);

        expect(func).toThrow(new errors.MissingArgError('id'));
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect id', () => {
        const clone = structuredClone(get);
        clone.id = 'asd';
        const func = (): void => Validation.validateGet(clone);
        expect(func).toThrow(new errors.IncorrectArgTypeError('Provided party id is invalid'));
      });
    });
  });

  describe('Should pass', () => {
    it('Validated', () => {
      const func = (): void => Validation.validateGet(get);
      expect(func).not.toThrow();
    });
  });
});
