import RemoveProfileDto from './dto';
import { UserDoesNotExist } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IRemoveProfileDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async remove(data: IRemoveProfileDto): Promise<void> {
    const { id } = new RemoveProfileDto(data);

    const exist = await this.rooster.getByUser(id);
    if (!exist) throw new UserDoesNotExist();
    await this.rooster.remove(exist._id);
  }
}
