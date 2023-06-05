import Validation from '../../../tools/validation';
import type { IUseItemDto } from './types';
import type { IDropItemDto } from '../drop/types';

export default class UseItemDto implements IUseItemDto {
  itemId: string;
  amount: number;

  constructor(data: IDropItemDto) {
    this.itemId = data.itemId;
    this.amount = data.amount;

    this.validate();
  }

  private validate(): void {
    new Validation(this.itemId, 'itemId').isDefined().isString().isObjectId();
    new Validation(this.amount, 'amount').isDefined().isNumber().isBetween(100, 1);
  }
}
