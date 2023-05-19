import User from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IUserEntity } from './entity';
import type { IUser } from './types';
import type { EModules } from '../../tools/abstract/enums';

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

  async getByLogin(data: string): Promise<IUserEntity | null> {
    return User.findOne({ login: data }).lean();
  }

  async getById(id: string): Promise<IUserEntity | null> {
    return User.findOne({ _id: id }).lean();
  }

  async remove(id: string): Promise<null> {
    return User.findOneAndRemove({ _id: id });
  }
}
