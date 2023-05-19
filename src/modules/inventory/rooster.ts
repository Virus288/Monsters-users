import Inventory from './model';
import type { IInventoryEntity } from './entity';
import RoosterFactory from '../../tools/abstract/rooster';
import type { EModules } from '../../tools/abstract/enums';
import type { IInventory } from './types';

export default class Rooster extends RoosterFactory<IInventory, typeof Inventory, EModules.Inventory> {
  constructor() {
    super(Inventory);
  }

  async getById(id: string): Promise<IInventoryEntity | null> {
    return Inventory.findOne({ _id: id }).lean();
  }

  async getByUser(id: string): Promise<IInventoryEntity | null> {
    return Inventory.findOne({ user: id }).lean();
  }

  async remove(id: string): Promise<null> {
    return Inventory.findOneAndRemove({ _id: id });
  }

  async update(id: string, data: Partial<IInventoryEntity>): Promise<void> {
    await Inventory.findOneAndUpdate({ user: id }, data);
  }
}
