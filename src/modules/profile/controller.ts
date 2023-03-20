import Rooster from './rooster';
import type * as types from '../../types';
import Validator from './validation';
import { ProfileAlreadyExists } from '../../errors';

export default class Controller {
  private readonly _rooster: Rooster;

  constructor() {
    this._rooster = new Rooster();
  }

  get rooster(): Rooster {
    return this._rooster;
  }

  async getProfile(data: types.IUserId, user: types.ILocalUser): Promise<types.IProfile> {
    Validator.validateUserId(user.tempId, data);
    return await this._rooster.get(data.id);
  }

  async addProfile(data: types.INewProfileReq, user: types.ILocalUser): Promise<void> {
    Validator.validateAddProfile(user.userId, data);
    const exist = await this._rooster.get(user.userId);
    if (exist) throw new ProfileAlreadyExists(user.tempId);
    return await this._rooster.add({ ...data, user: user.userId });
  }
}
