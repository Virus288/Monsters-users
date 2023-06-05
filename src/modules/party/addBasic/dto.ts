import Validation from '../../../tools/validation';
import type { IAddBasicPartyDto } from './types';

export default class AddBasicPartyDto implements IAddBasicPartyDto {
  leader: string;

  constructor(data: IAddBasicPartyDto) {
    this.leader = data.leader;

    this.validate();
  }

  private validate(): void {
    new Validation(this.leader, 'leader').isDefined().isString().isObjectId();
  }
}
