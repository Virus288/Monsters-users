import Validation from '../../../tools/validation';
import type { IRemoveInventoryDto } from './types';

export default class RemoveInventoryDto implements IRemoveInventoryDto {
  owner: string;

  constructor(data: IRemoveInventoryDto) {
    this.owner = data.owner;

    this.validate();
  }

  private validate(): void {
    new Validation(this.owner, 'owner').isDefined().isString().isObjectId();
  }
}
