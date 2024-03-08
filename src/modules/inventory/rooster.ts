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
    return this.model.findOne({ userId: id }).lean();
  }

  async remove(user: string): Promise<null> {
    return this.model.findOneAndDelete({ userId: user });
  }

  override async update(id: string, data: Partial<IInventoryEntity>): Promise<void> {
    await this.model.findOneAndUpdate({ userId: id }, data);
  }
}
