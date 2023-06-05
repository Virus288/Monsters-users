import Validation from '../../../tools/validation';
import type { IUserDetailsDto } from './types';

export default class UserDetailsDto implements IUserDetailsDto {
  name?: string;
  id?: string;

  constructor(data: IUserDetailsDto) {
    this.name = data.name;
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    if (!this.name) {
      new Validation(this.id, 'id').isDefined().isString().isObjectId();
    }

    if (!this.id) {
      new Validation(this.name, 'name').isDefined().isString();
    }

    if (this.id && this.name) {
      new Validation(this.name, 'name').isDefined().isString();
      new Validation(this.id, 'id').isDefined().isString().isObjectId();
    }
  }
}
