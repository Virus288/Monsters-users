import Validation from '../../../tools/validation';
import type { IGetProfileDto } from './types';

export default class GetProfileDto implements IGetProfileDto {
  id: string;

  constructor(data: IGetProfileDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString().isObjectId();
  }
}
