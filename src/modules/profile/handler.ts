import AddController from './add';
import AddBasicController from './addBasic';
import CharacterStateController from './changeState';
import GetController from './get';
import RemoveController from './remove';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAddProfileDto } from './add/types';
import type { IAddBasicProfileDto } from './addBasic/types';
import type ChangeCharacterStatusDto from './changeState/dto';
import type { IProfileEntity } from './entity';
import type { IGetProfileDto } from './get/types';
import type { IRemoveProfileDto } from './remove/types';
import type { EModules } from '../../tools/abstract/enums';
import type * as types from '../../types';

export default class ProfileHandler extends HandlerFactory<EModules.Profiles> {
  private readonly _removeController: RemoveController;
  private readonly _addBasicController: AddBasicController;
  private readonly _addController: AddController;
  private readonly _characterStateController: CharacterStateController;

  constructor() {
    super(new GetController());
    this._removeController = new RemoveController();
    this._addBasicController = new AddBasicController();
    this._addController = new AddController();
    this._characterStateController = new CharacterStateController();
  }

  private get removeController(): RemoveController {
    return this._removeController;
  }

  private get addBasicController(): AddBasicController {
    return this._addBasicController;
  }

  private get characterStateController(): CharacterStateController {
    return this._characterStateController;
  }

  private get addController(): AddController {
    return this._addController;
  }

  async get(payload: unknown, user: types.ILocalUser): Promise<void> {
    const callBack = await this.getController.get(payload as IGetProfileDto);
    return State.broker.send(user.tempId, callBack, enums.EMessageTypes.Send);
  }

  async add(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.addController.add(payload as IAddProfileDto, user);
    return State.broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async addBasic(user: string, party: string, inventory: string): Promise<IProfileEntity> {
    return this.addBasicController.add({ user, party, inventory } as IAddBasicProfileDto);
  }

  async remove(id: string): Promise<void> {
    return this.removeController.remove({ id } as IRemoveProfileDto);
  }

  async changeState(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.characterStateController.changeState(payload as ChangeCharacterStatusDto, user);
    return State.broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
