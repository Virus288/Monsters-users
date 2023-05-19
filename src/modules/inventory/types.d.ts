import type { IInventoryEntity } from './entity';
import type mongoose from 'mongoose';

export interface IInventory extends IInventoryEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IInventoryItem {
  itemId: string;
  quantity: number;
}
