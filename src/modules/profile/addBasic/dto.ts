import Validation from '../../../tools/validation';
import type { IAddBasicProfileDto } from './types';

export default class AddBasicProfileDto implements IAddBasicProfileDto {
  userId: string;
  party: string;
  inventory: string;

  constructor(data: IAddBasicProfileDto) {
    this.userId = data.userId;
    this.party = data.party;
    this.inventory = data.inventory;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString().isObjectId();
    new Validation(this.party, 'party').isDefined().isString().isObjectId();
    new Validation(this.inventory, 'inventory').isDefined().isString().isObjectId();
  }
}
