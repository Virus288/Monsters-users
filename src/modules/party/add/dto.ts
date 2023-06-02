import Validation from '../../../tools/validation';
import type { IAddPartyDto } from './types';

export default class AddPartyDto implements IAddPartyDto {
  leader: string;
  characters: string[];

  constructor(data: IAddPartyDto) {
    this.leader = data.leader;
    this.characters = data.characters;

    this.validate();
  }

  private validate(): void {
    new Validation(this.leader, 'leader').isDefined().isString().isObjectId();
    new Validation(this.characters, 'characters').isDefined().isObjectIdArray().minElements(0).maxElements(10);
  }
}
