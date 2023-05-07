import type { ILocalUser } from '../types';
import State from '../tools/state';
import * as enums from '../enums';
import type * as types from '../types/connection';
import * as errors from '../errors';
import UserController from '../modules/user/handler';
import ProfileController from '../modules/profile/handler';
import type { IRemoveUserDto } from '../modules/user/dto';
import Validator from '../modules/user/validation';

export default class Handler {
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
        return this.user.register(payload.payload, payload.user);
      case enums.EUserTargets.GetName:
        return this.user.getDetails(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  async sharedMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.subTarget) {
      case enums.ESharedTargets.RemoveUser:
        return this.removeUser(payload.payload, payload.user);
      default:
        throw new errors.IncorrectTargetError();
    }
  }

  private async removeUser(payload: unknown, user: ILocalUser): Promise<void> {
    Validator.validateRemove(payload as IRemoveUserDto);
    const { name } = payload as IRemoveUserDto;

    const { _id } = await this.user.remove(name, user.userId!);
    await this.profile.remove(_id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
