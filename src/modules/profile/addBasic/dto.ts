import Validation from '../../../tools/validation';
import type { IAddBasicProfileDto } from './types';

export default class AddBasicProfileDto implements IAddBasicProfileDto {
  user: string;
  party: string;
  inventory: string;

  constructor(data: IAddBasicProfileDto) {
    this.user = data.user;
    this.party = data.party;
    this.inventory = data.inventory;

    this.validate();
  }

  private validate(): void {
    new Validation(this.user, 'user').isDefined().isString().isObjectId();
    new Validation(this.party, 'party').isDefined().isString().isObjectId();
    new Validation(this.inventory, 'inventory').isDefined().isString().isObjectId();
  }
}
