import UseItemDto from './dto';
import { InsufficientAmount, InventoryDoesNotExist, ItemNotInInventory } from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IUseItemDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async use(data: IUseItemDto, userId: string): Promise<void> {
    const { itemId, amount } = new UseItemDto(data);

    const eq = await this.rooster.getByUser(userId);
    if (!eq) throw new InventoryDoesNotExist();

    const exist = eq.items.find((e) => {
      return e.itemId.toString() === itemId;
    });

    if (!exist) throw new ItemNotInInventory();
    if (exist.quantity < amount) throw new InsufficientAmount();

    eq.items = [...eq.items, { ...exist, quantity: (exist.quantity -= amount) }];
    await this.rooster.update(userId, eq);
  }
}