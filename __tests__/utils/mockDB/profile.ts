import { IProfileLean } from '../../../src/types';
import * as enums from '../../../src/enums';
import Profile from '../../../src/modules/profile/model';

export default class FakeProfile {
  state: IProfileLean = {
    _id: undefined,
    user: undefined,
    race: enums.EUserRace.Human,
    friends: [],
    lvl: 1,
    exp: [1, 10],
  };

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

  async create(): Promise<void> {
    const NewProfile = new Profile(this.state);
    await NewProfile.save();
  }

  clean(): void {
    this.state = {
      _id: undefined,
      user: undefined,
      race: undefined,
      friends: [],
      lvl: 0,
      exp: [0, 0],
    };
  }

  async cleanUp(): Promise<void> {
    await Profile.findOneAndDelete({ user: this.state.user });
    this.clean();
  }
}
