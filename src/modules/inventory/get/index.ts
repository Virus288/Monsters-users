import GetInventoryDto from './dto';
import { InventoryDoesNotExist } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetInventoryDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IInventoryEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IGetInventoryDto): Promise<IInventoryEntity> {
    const payload = new GetInventoryDto(data);
    const eq = await this.rooster.getByUser(payload.userId);
    if (!eq) throw new InventoryDoesNotExist();

    return eq;
  }
}
