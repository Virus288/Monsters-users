import mongoose from 'mongoose';
import type { IItem } from './types';

export const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'item name not provided'],
    unique: true,
  },
});

export default mongoose.model<IItem>('Item', itemsSchema);
