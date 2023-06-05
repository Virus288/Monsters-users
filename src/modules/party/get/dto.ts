import Validation from '../../../tools/validation';
import type { IGetPartyDto } from './types';

export default class GetPartyDto implements IGetPartyDto {
  id: string;

  constructor(data: IGetPartyDto) {
    this.id = data.id;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString().isObjectId();
  }
}
