import type * as types from '../types';
import * as enums from '../enums';
import * as errors from '../errors';
import UserController from '../modules/user/handler';
import ProfileController from '../modules/profile/handler';

export default class Router {
  private readonly _user: UserController;
  private readonly _profile: ProfileController;

  constructor() {
    this._user = new UserController();
  }

  private get user(): UserController {
    return this._user;
  }

  private get profile(): ProfileController {
    return this._profile;
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EMessageTargets.Profile:
        return this.profileMessage(payload);
      case enums.EMessageTargets.User:
        return this.userMessage(payload);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }

  private async profileMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EProfileTargets.Create:
        return await this.profile.addProfile(payload.payload, payload.user);
      case enums.EProfileTargets.Get:
        return await this.profile.getProfile(payload.payload, payload.user);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }

  private async userMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EUserTargets.Login:
        return await this.user.login(payload.payload, payload.user);
      case enums.EUserTargets.Register:
        return await this.user.register(payload.payload, payload.user);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }
}
