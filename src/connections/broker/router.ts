import Handler from './handler';
import * as enums from '../../enums';
import * as errors from '../../errors';
import type * as types from '../../types';

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
      case enums.EMessageTargets.Log:
        return this.handler.logMessages(payload);
      case enums.EMessageTargets.Profile:
        return this.handler.profileMessage(payload);
      case enums.EMessageTargets.CharacterState:
        return this.handler.characterStateMessage(payload);
      case enums.EMessageTargets.User:
        return this.handler.userMessage(payload);
      case enums.EMessageTargets.Inventory:
        return this.handler.inventoryMessage(payload);
      case enums.EMessageTargets.Party:
        return this.handler.partyMessage(payload);
      case enums.EMessageTargets.BugReport:
        return this.handler.bugReportMessage(payload);
      default:
        throw new errors.IncorrectTargetError();
    }
  }
}
