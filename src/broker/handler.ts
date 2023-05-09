import * as enums from '../enums';
import type * as types from '../types/connection';
import * as errors from '../errors';
import UserController from '../modules/user/handler';
import ProfileController from '../modules/profile/handler';
import Controller from './controller';

export default class Handler {
  private readonly _user: UserController;
  private readonly _profile: ProfileController;
  private readonly _controller: Controller;

  constructor() {
    this._user = new UserController();
    this._profile = new ProfileController();
    this._controller = new Controller(this.user, this.profile);
  }

  private get user(): UserController {
    return this._user;
  }

  private get profile(): ProfileController {
    return this._profile;
  }

  private get controller(): Controller {
    return this._controller;
  }

  async profileMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EProfileTargets.Create:
        return this.profile.add(payload.payload, payload.user);
      case enums.EProfileTargets.Get:
        return this.profile.get(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  async userMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.EUserTargets.Login:
        return this.user.login(payload.payload, payload.user);
      case enums.EUserTargets.Register:
        return this.controller.register(payload.payload, payload.user);
      case enums.EUserTargets.GetName:
        return this.user.getDetails(payload.payload, payload.user);
      case enums.ESharedTargets.RemoveUser:
        return this.controller.removeUser(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
