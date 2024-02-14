import RemovePartyDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IRemovePartyDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Party> {
  constructor() {
    super(new Rooster());
  }

  async remove(data: IRemovePartyDto): Promise<void> {
    const { leader } = new RemovePartyDto(data);

    await this.rooster.remove(leader);
  }
}
