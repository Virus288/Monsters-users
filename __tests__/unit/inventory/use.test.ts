import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import UseItemDto from '../../../src/modules/inventory/use/dto';
import * as utils from '../../utils';
import type { IUseItemDto } from '../../../src/modules/inventory/use/types';
import type { IItemEntity } from '../../../src/modules/items/entity';

describe('Use items', () => {
  const fakeItem = utils.fakeData.items[0] as IItemEntity;
  const use: IUseItemDto = {
    itemId: fakeItem._id,
    amount: 1,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing itemId', () => {
        const clone = structuredClone(use);
        clone.itemId = undefined!;

        try {
          new UseItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        }
      });

      it('Missing amount', () => {
        const clone = structuredClone(use);
        clone.amount = undefined!;

        try {
          new UseItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('amount'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('ItemId is not valid id', () => {
        const clone = structuredClone(use);
        clone.itemId = 'asd';

        try {
          new UseItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('itemId should be objectId'));
        }
      });

      it('Amount less than 1', () => {
        const clone = structuredClone(use);
        clone.amount = 0;

        try {
          new UseItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('amount', 1, 100));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Drop items', () => {
      try {
        new UseItemDto(use);
        expect(use.itemId).toEqual(use.itemId);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
