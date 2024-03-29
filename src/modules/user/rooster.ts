import User from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IUserEntity } from './entity';
import type { IUser } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IUser, typeof User, EModules.Users> {
  constructor() {
    super(User);
  }

  async getAll(page: number): Promise<IUserEntity[]> {
    return this.model
      .find()
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async getByEmail(data: string): Promise<IUserEntity | null> {
    return this.model.findOne({ email: data }).lean();
  }

  async getByLogin(data: string): Promise<IUserEntity | null> {
    return this.model.findOne({ login: data }).lean();
  }

  async remove(id: string): Promise<null> {
    return this.model.findOneAndDelete({ _id: id });
  }
}
