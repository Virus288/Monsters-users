import AddPartyDto from './dto';
import { PartyAlreadyExists } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddPartyDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Party> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddPartyDto, userId: string): Promise<void> {
    const payload = new AddPartyDto(data);

    const party = await this.rooster.getByLeader(userId);
    if (party) throw new PartyAlreadyExists();

    await this.rooster.add(payload);
  }
}
