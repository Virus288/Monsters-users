import Rooster from './rooster';
import { InsufficientAmount, InventoryDoesNotExist, ItemNotInInventory } from '../../errors';
import Validator from './validation';
import type { IDropItemDto, IUseItemDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import type { IInventoryEntity } from './entity';

export default class Controller extends ControllerFactory<EModules.Inventory> {
  constructor() {
    super(new Rooster());
  }

  async get(userId: string): Promise<IInventoryEntity> {
    const eq = await this.rooster.getByUser(userId);
    if (!eq) throw new InventoryDoesNotExist();

    return eq;
  }

  async use(payload: IUseItemDto, userId: string): Promise<void> {
    Validator.validateUseItem(payload);

    const { itemId, amount } = payload;

    const eq = await this.rooster.getByUser(userId);
    if (!eq) throw new InventoryDoesNotExist();

    const exist = eq.items.find((e) => {
      return e.itemId === itemId;
    });

    if (!exist) throw new ItemNotInInventory();
    if (exist.quantity < amount) throw new InsufficientAmount();

    eq.items = [...eq.items, { ...exist, quantity: (exist.quantity -= amount) }];
    await this.rooster.update(userId, eq);
  }

  async drop(payload: IDropItemDto, userId: string): Promise<void> {
    Validator.validateDropItem(payload);

    const { itemId, amount } = payload;

    const eq = await this.rooster.getByUser(userId);
    if (!eq) throw new InventoryDoesNotExist();

    const exist = eq.items.find((e) => {
      return e.itemId === itemId;
    });

    if (!exist) throw new ItemNotInInventory();
    if (exist.quantity < amount) throw new InsufficientAmount();

    eq.items = [...eq.items, { ...exist, quantity: (exist.quantity -= amount) }];
    await this.rooster.update(userId, eq);
  }
}
