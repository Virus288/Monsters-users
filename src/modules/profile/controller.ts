import Rooster from './rooster';
import type * as types from '../../types';
import { INewProfile } from '../../types';
import Validator from '../../validation';

export default class Controller {
  private rooster: Rooster;

  constructor() {
    this.rooster = new Rooster();
  }

  async getProfile(data: types.IUserId, user: types.ILocalUser): Promise<types.IProfile> {
    Validator.validateUserId(user.tempId, data);
    return await this.rooster.get(data.id);
  }

  async addProfile(data: INewProfile, user: types.ILocalUser): Promise<void> {
    Validator.validateAddProfile(user.tempId, data);
    return await this.rooster.add(data);
  }
}
