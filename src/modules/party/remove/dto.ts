import Validation from '../../../tools/validation';
import type { IRemovePartyDto } from './types';

export default class RemovePartyDto implements IRemovePartyDto {
  leader: string;

  constructor(data: IRemovePartyDto) {
    this.leader = data.leader;

    this.validate();
  }

  private validate(): void {
    new Validation(this.leader, 'leader').isDefined().isString().isObjectId();
  }
}
