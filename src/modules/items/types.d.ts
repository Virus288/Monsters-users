import type { IItemEntity } from './entity';
import type mongoose from 'mongoose';

export interface IItem extends IItemEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
