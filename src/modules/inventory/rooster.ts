import Inventory from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IInventoryEntity } from './entity';
import type { IInventory } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IInventory, typeof Inventory, EModules.Inventory> {
  constructor() {
    super(Inventory);
  }

  async getByUser(id: string): Promise<IInventoryEntity | null> {
    return Inventory.findOne({ userId: id }).lean();
  }

  async remove(id: string): Promise<null> {
    return Inventory.findOneAndDelete({ _id: id });
  }

  override async update(id: string, data: Partial<IInventoryEntity>): Promise<void> {
    await Inventory.findOneAndUpdate({ userId: id }, data);
  }
}
