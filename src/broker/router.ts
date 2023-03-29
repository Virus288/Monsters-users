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
    this._profile = new ProfileController();
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
        throw new errors.IncorrectTargetError();
    }
  }

  private async profileMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EProfileTargets.Create:
        return this.profile.add(payload.payload, payload.user);
      case enums.EProfileTargets.Get:
        return this.profile.get(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async userMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EUserTargets.Login:
        return this.user.login(payload.payload, payload.user);
      case enums.EUserTargets.Register:
        return this.user.register(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
