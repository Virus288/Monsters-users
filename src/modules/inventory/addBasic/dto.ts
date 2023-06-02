import Validation from '../../../tools/validation';
import type { IAddBasicInventoryDto } from './types';

export default class AddBasicInventoryDto implements IAddBasicInventoryDto {
  userId: string;

  constructor(data: IAddBasicInventoryDto) {
    this.userId = data.userId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString().isObjectId();
  }
}
