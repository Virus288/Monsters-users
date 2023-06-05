import AddBasicInventoryDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddBasicInventoryDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IInventoryEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddBasicInventoryDto): Promise<IInventoryEntity> {
    const payload = new AddBasicInventoryDto(data);
    return this.rooster.addDefault(payload);
  }
}
