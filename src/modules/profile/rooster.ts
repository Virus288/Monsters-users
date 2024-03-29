import Profile from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IProfileEntity } from './entity';
import type { IProfile } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IProfile, typeof Profile, EModules.Profiles> {
  constructor() {
    super(Profile);
  }

  async getByUser(id: string): Promise<IProfileEntity | null> {
    return this.model.findOne({ user: id }).lean();
  }

  async remove(id: string): Promise<null> {
    return this.model.findOneAndDelete({ _id: id });
  }
}
