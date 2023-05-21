import Controller from './controller';
import * as enums from '../../enums';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { ICreatePartyDto, IGetPartyDto } from './dto';
import type { IPartyEntity } from './entity';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class Handler extends HandlerFactory<EModules.Party> {
  constructor() {
    super(new Controller());
  }

  async get(payload: unknown, user: ILocalUser): Promise<void> {
    const party = await this.controller.get(payload as IGetPartyDto);
    return State.Broker.send(user.tempId, party, enums.EMessageTypes.Send);
  }

  async create(payload: unknown, user: ILocalUser): Promise<void> {
    await this.controller.create(payload as ICreatePartyDto, user.userId!);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }

  async addBasic(id: string): Promise<IPartyEntity> {
    return this.controller.addBasicParty(id);
  }
}
