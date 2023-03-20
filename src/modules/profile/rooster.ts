import Profile from './model';
import type * as types from '../../types';

export default class Rooster {
  async add(data: types.INewProfile): Promise<void> {
    const newProfile = new Profile(data);
    await newProfile.save();
  }

  async get(id: string): Promise<types.IProfile> {
    return Profile.findOne({ user: id });
  }
}
