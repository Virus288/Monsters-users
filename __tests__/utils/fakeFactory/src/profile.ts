import TemplateFactory from './abstracts';
import Profile from '../../../../src/modules/profile/model';
import type * as enums from '../../../../src/enums';
import type { IProfileEntity } from '../../../../src/modules/profile/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeProfile extends TemplateFactory<EFakeData.Profile> implements IAbstractBody<IProfileEntity> {
  constructor() {
    super(Profile);
  }

  user(user?: string): this {
    this.state.user = user;
    return this;
  }

  race(race?: enums.EUserRace): this {
    this.state.race = race;
    return this;
  }

  friends(friends?: string[]): this {
    this.state.friends = friends;
    return this;
  }

  lvl(lvl?: number): this {
    this.state.lvl = lvl;
    return this;
  }

  exp(exp?: number[]): this {
    this.state.exp = exp;
    return this;
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  initialized(initialized: boolean): this {
    this.state.initialized = initialized;
    return this;
  }

  inventory(inventory: string): this {
    this.state.inventory = inventory;
    return this;
  }

  party(party: string): this {
    this.state.party = party;
    return this;
  }

  protected fillState(): void {
    this.state = {
      _id: undefined,
      exp: [0, 10],
      friends: [],
      lvl: 1,
      race: undefined,
      user: undefined,
      party: undefined,
      inventory: undefined,
      initialized: false,
    };
  }
}
