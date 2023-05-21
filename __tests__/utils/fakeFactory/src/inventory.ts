import TemplateFactory from './abstracts';
import Inventory from '../../../../src/modules/inventory/model';
import type { IInventoryEntity } from '../../../../src/modules/inventory/entity';
import type { IInventoryItem } from '../../../../src/modules/inventory/types';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

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

  userId(id?: string): this {
    this.state.userId = id;
    return this;
  }

  protected fillState(): void {
    this.state = {
      items: [],
      userId: undefined,
      _id: undefined,
    };
  }
}
