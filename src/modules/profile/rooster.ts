import Profile from './model';
import type { IProfileEntity } from './entity';
import RoosterFactory from '../../tools/abstract/rooster';
import type { EModules } from '../../tools/abstract/enums';
import type { IProfile } from './types';

export default class Rooster extends RoosterFactory<IProfile, typeof Profile, EModules.Profiles> {
  constructor() {
    super(Profile);
  }

  async get(id: string): Promise<IProfileEntity> {
    return Profile.findOne({ user: id }).lean();
  }
}
