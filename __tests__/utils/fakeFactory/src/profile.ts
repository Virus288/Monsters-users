import TemplateFactory from './abstracts';
import * as enums from '../../../../src/enums';
import Profile from '../../../../src/modules/profile/model';
import type { IProfileEntity } from '../../../../src/modules/profile/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeProfile extends TemplateFactory<EFakeData.Profile> implements IAbstractBody<IProfileEntity> {
  constructor() {
    super(Profile);
  }

  user(user?: string): this {
    this.data.user = user;
    return this;
  }

  race(race?: enums.EUserRace): this {
    this.data.race = race;
    return this;
  }

  friends(friends?: string[]): this {
    this.data.friends = friends;
    return this;
  }

  lvl(lvl?: number): this {
    this.data.lvl = lvl;
    return this;
  }

  exp(exp?: number[]): this {
    this.data.exp = exp;
    return this;
  }

  _id(id?: string): this {
    this.data._id = id;
    return this;
  }

  initialized(initialized: boolean): this {
    this.data.initialized = initialized;
    return this;
  }

  inventory(inventory: string): this {
    this.data.inventory = inventory;
    return this;
  }

  party(party: string): this {
    this.data.party = party;
    return this;
  }

  state(state: enums.ECharacterState): this {
    this.data.state = state;
    return this;
  }

  protected override fillState(): void {
    this.data = {
      _id: undefined,
      exp: [0, 10],
      friends: [],
      lvl: 1,
      race: undefined,
      user: undefined,
      party: undefined,
      inventory: undefined,
      initialized: false,
      state: enums.ECharacterState.Map,
    };
  }
}
