import type { ILocalUser } from '../types';
import UserValidator from '../modules/user/validation';
import ProfileValidator from '../modules/profile/validation';
import type { IRegisterDto, IRemoveUserDto } from '../modules/user/dto';
import State from '../tools/state';
import * as enums from '../enums';
import type UserController from '../modules/user/handler';
import type ProfileController from '../modules/profile/handler';
import type InventoryController from '../modules/inventory/handler';
import type PartyContainer from '../modules/party/handler';
import type { IAddProfileDto } from '../modules/profile/dto';

export default class Controller {
  private readonly _user: UserController;
  private readonly _profile: ProfileController;
  private readonly _inventory: InventoryController;
  private readonly _party: PartyContainer;

  constructor(user: UserController, profile: ProfileController, inventory: InventoryController, party: PartyContainer) {
    this._user = user;
    this._profile = profile;
    this._inventory = inventory;
    this._party = party;
  }

  private get user(): UserController {
    return this._user;
  }

  private get profile(): ProfileController {
    return this._profile;
  }

  private get party(): ProfileController {
    return this._profile;
  }

  private get inventory(): ProfileController {
    return this._profile;
  }

  async removeUser(payload: unknown, user: ILocalUser): Promise<void> {
    UserValidator.validateRemove(payload as IRemoveUserDto);
    const { name } = payload as IRemoveUserDto;

    const { _id } = await this.user.remove(name, user.userId!);
    await this.profile.remove(_id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async register(payload: unknown, user: ILocalUser): Promise<void> {
    const data = payload as IRegisterDto;
    UserValidator.validateRegister(data);

    const id = await this.user.register(data);
    await this.profile.addBasic(id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async addProfile(payload: unknown, user: ILocalUser): Promise<void> {
    const data = payload as IAddProfileDto;
    ProfileValidator.validateAddProfile(data);

    const { _id } = this.party.addBasic();
    const { _id } = this.inventory.addBasic();

    const id = await this.user.register(data);
    await this.profile.addBasic(id);

    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
