import type * as enums from '../../../../src/enums';
import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import Profile from '../../../../src/modules/profile/model';
import type { IAbstractBody } from '../types/data';
import type { IProfileEntity } from '../../../../src/modules/profile/entity';

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

  exp(exp?: [number, number]): this {
    this.state.exp = exp;
    return this;
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  protected fillState(): void {
    this.state = { _id: undefined, exp: [0, 10], friends: [], lvl: 1, race: undefined, user: undefined };
  }
}
