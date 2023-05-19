import Profile from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IProfileEntity } from './entity';
import type { IProfile } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IProfile, typeof Profile, EModules.Profiles> {
  constructor() {
    super(Profile);
  }

  async get(id: string): Promise<IProfileEntity | null> {
    return Profile.findOne({ user: id }).lean();
  }

  async getById(id: string): Promise<IProfileEntity | null> {
    return Profile.findOne({ _id: id }).lean();
  }

  async remove(id: string): Promise<null> {
    return Profile.findOneAndRemove({ _id: id });
  }
}
