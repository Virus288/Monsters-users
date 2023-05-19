import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import Inventory from '../../../../src/modules/inventory/model';
import type { IAbstractBody } from '../types/data';
import type { IInventoryEntity } from '../../../../src/modules/inventory/entity';
import type { IInventoryItem } from '../../../../src/modules/inventory/types';

export default class FakeInventory
  extends TemplateFactory<EFakeData.Inventory>
  implements IAbstractBody<IInventoryEntity>
{
  constructor() {
    super(Inventory);
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  items(items: IInventoryItem[]): this {
    this.state.items = items;
    return this;
  }

  user(user: string): this {
    this.state.user = user;
    return this;
  }

  protected fillState(): void {
    this.state = {
      items: [],
      user: undefined,
    };
  }
}
