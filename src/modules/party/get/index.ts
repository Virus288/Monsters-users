import GetPartyDto from './dto';
import { PartyDoesNotExist } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetPartyDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IPartyEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Party> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IGetPartyDto): Promise<IPartyEntity> {
    const { id } = new GetPartyDto(data);

    const eq = await this.rooster.get(id);
    if (!eq) throw new PartyDoesNotExist();

    return eq;
  }
}
