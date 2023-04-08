import State from '../../tools/state';
import * as enums from '../../enums';
import type { ILocalUser } from '../../types';
import type { ILoginDto, IRegisterDto } from './dto';
import HandlerFactory from '../../tools/abstract/handler';
import type { EModules } from '../../tools/abstract/enums';
import Controller from './controller';

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
}
