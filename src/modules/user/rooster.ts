import User from './model';
import type { IUserEntity } from './entity';
import RoosterFactory from '../../tools/abstract/rooster';
import type { EModules } from '../../tools/abstract/enums';
import type { IUser } from './types';

export default class Rooster extends RoosterFactory<IUser, typeof User, EModules.Users> {
  constructor() {
    super(User);
  }

  async get(data: string): Promise<IUserEntity[]> {
    return User.find({ $or: [{ login: data }, { email: data }] }).lean();
  }

  async getByEmail(data: string): Promise<IUserEntity[]> {
    return User.find({ email: data }).lean();
  }

  async getByLogin(data: string): Promise<IUserEntity[]> {
    return User.find({ login: data }).lean();
  }
}
