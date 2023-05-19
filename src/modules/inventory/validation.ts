import type { IDropItemDto, IUseItemDto } from './dto';
import * as errors from '../../errors';
import mongoose from 'mongoose';

export default class Validator {
  static validateUseItem(data: IUseItemDto): void {
    if (!data.itemId) throw new errors.MissingArgError('itemId');
    if (data.amount === undefined) throw new errors.MissingArgError('amount');
    Validator.validateUse(data);
  }

  static validateDropItem(data: IDropItemDto): void {
    if (!data.itemId) throw new errors.MissingArgError('itemId');
    if (data.amount === undefined) throw new errors.MissingArgError('amount');
    Validator.validateUse(data);
  }

  private static validateUse(data: IUseItemDto): void {
    const { amount, itemId } = data;
    if (typeof amount !== 'number') throw new errors.IncorrectArgTypeError('amount is not number');
    if (typeof itemId !== 'string') throw new errors.IncorrectArgTypeError('itemId is not string');

    if (amount <= 0) throw new errors.IncorrectArgAmountError('amount', 0, 100);
    const isValid = mongoose.Types.ObjectId.isValid(itemId);
    if (!isValid) throw new errors.IncorrectArgError('Provided itemId is invalid');
  }
}
