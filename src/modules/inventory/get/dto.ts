import Validation from '../../../tools/validation';
import type { IGetInventoryDto } from './types';

export default class GetInventoryDto implements IGetInventoryDto {
  userId: string;

  constructor(data: IGetInventoryDto) {
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString().isObjectId();
  }
}
