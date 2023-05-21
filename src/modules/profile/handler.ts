import Controller from './controller';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IAddProfileDto, IGetProfileDto } from './dto';
import type { IProfileEntity } from './entity';
import type { EModules } from '../../tools/abstract/enums';
import type * as types from '../../types';

export default class ProfileHandler extends HandlerFactory<EModules.Profiles> {
  constructor() {
    super(new Controller());
  }

  async get(payload: unknown, user: types.ILocalUser): Promise<void> {
    const profile = await this.controller.getProfile(payload as IGetProfileDto);
    return State.Broker.send(user.tempId, profile, enums.EMessageTypes.Send);
  }

  async add(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.controller.addProfile(payload as IAddProfileDto, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async remove(userId: string): Promise<void> {
    return this.controller.remove(userId);
  }

  async addBasic(id: string, party: string, inventory: string): Promise<IProfileEntity> {
    return this.controller.addBasicProfile(id, party, inventory);
  }
}
