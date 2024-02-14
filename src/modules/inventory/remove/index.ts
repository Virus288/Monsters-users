import RemoveInventoryDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IRemoveInventoryDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async remove(data: IRemoveInventoryDto): Promise<void> {
    const { owner } = new RemoveInventoryDto(data);

    await this.rooster.remove(owner);
  }
}
