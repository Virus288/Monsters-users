import * as enums from '../../../../src/enums';
import TemplateFactory from './abstracts';
import { EFakeData } from '../enums';
import Profile from '../../../../src/modules/profile/model';

export default class FakeProfile extends TemplateFactory<EFakeData.Profile> {
  constructor() {
    super();
    this.target = Profile;
    this.fillState();
  }

  user(user: string): this {
    this.state.user = user;
    return this;
  }

  race(race: enums.EUserRace): this {
    this.state.race = race;
    return this;
  }

  friends(friends: string[]): this {
    this.state.friends = friends;
    return this;
  }

  lvl(lvl: number): this {
    this.state.lvl = lvl;
    return this;
  }

  exp(exp: [number, number]): this {
    this.state.exp = exp;
    return this;
  }

  id(id: string): this {
    this.state.id = id;
    return this;
  }

  private fillState(): void {
    this.state = { _id: undefined, exp: [0, 10], friends: [], lvl: 1, race: undefined, user: undefined };
  }
}
