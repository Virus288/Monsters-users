import type * as types from '../../types';
import State from '../../tools/state';
import * as enums from '../../enums';
import Controller from './controller';

export default class ProfileHandler {
  private readonly _controller: Controller;

  constructor() {
    this._controller = new Controller();
  }

  private get controller(): Controller {
    return this._controller;
  }

  async getProfile(payload: unknown, user: types.ILocalUser): Promise<void> {
    const profile = await this.controller.getProfile(payload as types.IUserId, user);
    return State.Broker.send(user.tempId, profile, enums.EMessageTypes.Send);
  }

  async addProfile(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.controller.addProfile(payload as types.INewProfileReq, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
