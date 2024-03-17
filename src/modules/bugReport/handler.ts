import AddController from './add';
import GetController from './get';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAddBugReport } from './add/types';
import type { IGetBugReport } from './get/types';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class BugReportHandler extends HandlerFactory<EModules.BugReport> {
  private readonly _addController: AddController;

  constructor() {
    super(new GetController());
    this._addController = new AddController();
  }

  private get addController(): AddController {
    return this._addController;
  }

  async add(payload: unknown, user: ILocalUser): Promise<void> {
    const callback = await this.addController.add(payload as IAddBugReport);
    return State.broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async get(payload: unknown, user: ILocalUser): Promise<void> {
    const callback = await this.getController.get(payload as IGetBugReport);
    return State.broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }
}
