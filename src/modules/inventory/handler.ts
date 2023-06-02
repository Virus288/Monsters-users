import AddBasicController from './addBasic';
import DropController from './drop';
import GetController from './get';
import UseController from './use';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAddBasicInventoryDto } from './addBasic/types';
import type { IDropItemDto } from './drop/types';
import type { IInventoryEntity } from './entity';
import type { IGetInventoryDto } from './get/types';
import type { IUseItemDto } from './use/types';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class Handler extends HandlerFactory<EModules.Inventory> {
  private readonly _addBasicController: AddBasicController;
  private readonly _dropController: DropController;
  private readonly _useController: UseController;

  constructor() {
    super(new GetController());
    this._addBasicController = new AddBasicController();
    this._dropController = new DropController();
    this._useController = new UseController();
  }

  private get addBasicController(): AddBasicController {
    return this._addBasicController;
  }

  private get useController(): UseController {
    return this._useController;
  }

  private get dropController(): DropController {
    return this._dropController;
  }

  async get(user: ILocalUser): Promise<void> {
    const callback = await this.getController.get({ userId: user.userId! } as IGetInventoryDto);
    return State.Broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async useItem(payload: unknown, user: ILocalUser): Promise<void> {
    await this.useController.use(payload as IUseItemDto, user.userId!);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async dropItem(payload: unknown, user: ILocalUser): Promise<void> {
    await this.dropController.drop(payload as IDropItemDto, user.userId!);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async addBasic(userId: string): Promise<IInventoryEntity> {
    return this.addBasicController.add({ userId } as IAddBasicInventoryDto);
  }
}
