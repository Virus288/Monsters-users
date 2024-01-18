import DropItemDto from './dto';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IDropItemDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async drop(data: IDropItemDto, userId: string): Promise<void> {
    const { itemId, amount } = new DropItemDto(data);

    const eq = await this.rooster.getByUser(userId);
    if (!eq) throw new errors.InventoryDoesNotExist();

    const exist = eq.items.find((e) => {
      return e.itemId.toString() === itemId;
    });

    if (!exist) throw new errors.ItemNotInInventory();
    if (exist.quantity < amount) throw new errors.InsufficientAmount();

    eq.items = [...eq.items, { ...exist, quantity: (exist.quantity -= amount) }];
    await this.rooster.update(userId, eq);
  }
}
