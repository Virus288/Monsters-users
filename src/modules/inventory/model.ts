import mongoose from 'mongoose';
import type { IInventory } from './types';

const itemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'itemId not provided'],
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

export const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'userId not provided'],
    unique: true,
  },
  items: {
    type: [itemSchema],
    default: [],
  },
});

export default mongoose.model<IInventory>('Inventory', inventorySchema);
