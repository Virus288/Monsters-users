import TemplateFactory from './abstracts';
import Party from '../../../../src/modules/party/model';
import type { IPartyEntity } from '../../../../src/modules/party/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeParty extends TemplateFactory<EFakeData.Party> implements IAbstractBody<IPartyEntity> {
  constructor() {
    super(Party);
  }

  leader(leader?: string): this {
    this.state.leader = leader;
    return this;
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  characters(characters?: string[]): this {
    this.state.characters = characters;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      leader: undefined,
      characters: [],
    };
  }
}
