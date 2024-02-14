import AddController from './add';
import AddBasicController from './addBasic';
import GetController from './get';
import RemoveController from './remove';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAddPartyDto } from './add/types';
import type { IAddBasicPartyDto } from './addBasic/types';
import type { IPartyEntity } from './entity';
import type { IGetPartyDto } from './get/types';
import type { IRemovePartyDto } from './remove/types';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class Handler extends HandlerFactory<EModules.Party> {
  private readonly _addBasicController: AddBasicController;
  private readonly _addController: AddController;
  private readonly _removeController: RemoveController;

  constructor() {
    super(new GetController());
    this._addBasicController = new AddBasicController();
    this._addController = new AddController();
    this._removeController = new RemoveController();
  }

  private get addBasicController(): AddBasicController {
    return this._addBasicController;
  }

  private get removeController(): RemoveController {
    return this._removeController;
  }

  private get addController(): AddController {
    return this._addController;
  }

  async get(payload: unknown, user: ILocalUser): Promise<void> {
    const callback = await this.getController.get(payload as IGetPartyDto);
    return State.broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async create(payload: unknown, user: ILocalUser): Promise<void> {
    await this.addController.add(payload as IAddPartyDto, user.userId!);
    return State.broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async addBasic(leader: string): Promise<IPartyEntity> {
    return this.addBasicController.add({ leader } as IAddBasicPartyDto);
  }

  async remove(leader: string): Promise<void> {
    return this.removeController.remove({ leader } as IRemovePartyDto);
  }
}
