import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import DropItemDto from '../../../src/modules/inventory/drop/dto';
import * as utils from '../../utils';
import type { IDropItemDto } from '../../../src/modules/inventory/drop/types';
import type { IItemEntity } from '../../../src/modules/items/entity';

describe('Drop items', () => {
  const fakeItem = utils.fakeData.items[0] as IItemEntity;
  const drop: IDropItemDto = {
    itemId: fakeItem._id,
    amount: 1,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing itemId', () => {
        const clone = structuredClone(drop);
        clone.itemId = undefined!;

        try {
          new DropItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        }
      });

      it('Missing amount', () => {
        const clone = structuredClone(drop);
        clone.amount = undefined!;

        try {
          new DropItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.MissingArgError('amount'));
        }
      });
    });

    describe('Incorrect data', () => {
      it('ItemId is not valid id', () => {
        const clone = structuredClone(drop);
        clone.itemId = 'asd';

        try {
          new DropItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgTypeError('itemId should be objectId'));
        }
      });

      it('Amount less than 1', () => {
        const clone = structuredClone(drop);
        clone.amount = 0;

        try {
          new DropItemDto(clone);
        } catch (err) {
          expect(err).toEqual(new errors.IncorrectArgLengthError('amount', 1, 100));
        }
      });
    });
  });

  describe('Should pass', () => {
    it('Drop items', () => {
      try {
        const body = new DropItemDto(drop);
        expect(body.itemId).toEqual(drop.itemId);
      } catch (err) {
        expect(err).toBeUndefined();
      }
    });
  });
});
