import { ECharacterState } from '../../../enums';
import Validation from '../../../tools/validation';
import type { IChangeCharacterStatusDto } from './types';

export default class ChangeCharacterStatusDto implements IChangeCharacterStatusDto {
  state: ECharacterState;

  constructor(data: IChangeCharacterStatusDto) {
    this.state = data.state;

    this.validate();
  }

  private validate(): void {
    new Validation(this.state, 'state').isDefined().isString().isPartOfEnum(ECharacterState);
  }
}
