import type * as types from '../types';
import * as enums from '../enums';
import * as errors from '../errors';
import Handler from './handler';

export default class Router {
  private readonly _handler: Handler;

  constructor() {
    this._handler = new Handler();
  }

  private get handler(): Handler {
    return this._handler;
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EMessageTargets.Profile:
        return this.handler.profileMessage(payload);
      case enums.EMessageTargets.Shared:
        return this.handler.sharedMessage(payload);
      case enums.EMessageTargets.User:
        return this.handler.userMessage(payload);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
