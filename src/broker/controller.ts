import type { ILocalUser } from '../types';
import Validator from '../modules/user/validation';
import type { IRegisterDto, IRemoveUserDto } from '../modules/user/dto';
import State from '../tools/state';
import * as enums from '../enums';
import type UserController from '../modules/user/handler';
import type ProfileController from '../modules/profile/handler';

export default class Controller {
  private readonly _user: UserController;
  private readonly _profile: ProfileController;

  constructor(user: UserController, profile: ProfileController) {
    this._user = user;
    this._profile = profile;
  }

  private get user(): UserController {
    return this._user;
  }

  private get profile(): ProfileController {
    return this._profile;
  }

  async removeUser(payload: unknown, user: ILocalUser): Promise<void> {
    Validator.validateRemove(payload as IRemoveUserDto);
    const { name } = payload as IRemoveUserDto;

    const { _id } = await this.user.remove(name, user.userId!);
    await this.profile.remove(_id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async register(payload: unknown, user: ILocalUser): Promise<void> {
    const data = payload as IRegisterDto;
    Validator.validateRegister(data);

    const id = await this.user.register(data);
    await this.profile.addBasic(id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
