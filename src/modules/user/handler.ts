import Controller from './controller';
import * as types from '../../types';
import State from '../../tools/state';
import * as enums from '../../enums';

export default class UserHandler {
  private readonly _controller: Controller;

  constructor() {
    this._controller = new Controller();
  }

  private get controller(): Controller {
    return this._controller;
  }

  async login(payload: unknown, user: types.ILocalUser): Promise<void> {
    const data = await this.controller.login(payload as types.ILoginReq, user);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Credentials);
  }

  async register(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.controller.register(payload as types.IRegisterReq, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
