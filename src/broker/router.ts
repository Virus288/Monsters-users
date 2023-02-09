import type * as types from '../types';
import * as enums from '../enums';
import * as errors from '../errors';
import Users from '../modules/user/controller';
import Profiles from '../modules/profile/controller';
import State from '../tools/state';

export default class Router {
  private _users: Users;
  private _profiles: Profiles;

  constructor() {
    this._users = new Users();
    this._profiles = new Profiles();
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EUserTargets.Login:
        return await this.login(payload.payload, payload.user);
      case enums.EUserTargets.Register:
        return await this.register(payload.payload, payload.user);
      case enums.EProfileTargets.Create:
        return await this.addProfile(payload.payload, payload.user);
      case enums.EProfileTargets.Get:
        return await this.getProfile(payload.payload, payload.user);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }

  private async login(payload: unknown, user: types.ILocalUser): Promise<void> {
    const data = await this._users.login(payload as types.ILoginReq, user);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Credentials);
  }

  private async register(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this._users.register(payload as types.IRegisterReq, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  private async getProfile(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this._profiles.getProfile(payload as types.IUserId, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  private async addProfile(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this._profiles.addProfile(payload as types.INewProfile, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
