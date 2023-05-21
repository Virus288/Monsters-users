import { describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Validation from '../../../src/modules/inventory/validation';
import { fakeData } from '../../utils';
import type { IUseItemDto } from '../../../src/modules/inventory/dto';
import type { IItemEntity } from '../../../src/modules/items/entity';

describe('Use items', () => {
  const fakeItem = fakeData.items[0] as IItemEntity;
  const use: IUseItemDto = {
    itemId: fakeItem._id,
    amount: 1,
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing itemId', () => {
        const clone = structuredClone(use);
        clone.itemId = undefined!;
        const func = (): void => Validation.validateUseItem(clone);

        expect(func).toThrow(new errors.MissingArgError('itemId'));
      });

      it('Missing amount', () => {
        const clone = structuredClone(use);
        clone.amount = undefined!;
        const func = (): void => Validation.validateUseItem(clone);

        expect(func).toThrow(new errors.MissingArgError('amount'));
      });
    });

    describe('Incorrect data', () => {
      it('ItemId is not valid id', () => {
        const clone = structuredClone(use);
        clone.itemId = 'asd';
        const func = (): void => Validation.validateUseItem(clone);

        expect(func).toThrow(new errors.IncorrectArgError('Provided itemId is invalid'));
      });

      it('Amount less than 1', () => {
        const clone = structuredClone(use);
        clone.amount = 0;
        const func = (): void => Validation.validateUseItem(clone);

        expect(func).toThrow(new errors.IncorrectArgAmountError('amount', 0, 100));
      });
    });
  });

  describe('Should pass', () => {
    it('Drop items', () => {
      const func = (): void => Validation.validateUseItem(use);

      expect(func).not.toThrow();
    });
  });
});
