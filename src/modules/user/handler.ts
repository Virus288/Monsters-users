import State from '../../tools/state';
import * as enums from '../../enums';
import type { ILocalUser } from '../../types';
import type { ILoginDto, IRegisterDto, IUserDetailsDto } from './dto';
import HandlerFactory from '../../tools/abstract/handler';
import type { EModules } from '../../tools/abstract/enums';
import Controller from './controller';
import * as errors from '../../errors';
import type { IUserEntity } from './entity';

export default class UserHandler extends HandlerFactory<EModules.Users> {
  constructor() {
    super(new Controller());
  }

  async login(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.controller.login(payload as ILoginDto);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Credentials);
  }

  async register(payload: unknown, user: ILocalUser): Promise<void> {
    await this.controller.register(payload as IRegisterDto);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async getDetails(payload: unknown, user: ILocalUser): Promise<void> {
    const data = await this.controller.getDetails(payload as IUserDetailsDto);
    const callback = data === null ? null : { id: data._id, name: data.login };
    return State.Broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async remove(name: string, userId: string): Promise<IUserEntity> {
    const user = await this.controller.getDetails({ name } as IUserDetailsDto);
    if (!user) throw new errors.UserDoesNotExist();
    if (user._id.toString() !== userId) throw new errors.NoPermission();

    await this.controller.remove(user._id);
    await State.Redis.addRemovedUser(name);
    return user;
  }
}
