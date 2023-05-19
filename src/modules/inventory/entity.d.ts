import type { IInventoryItem } from './types';

export interface IInventoryEntity {
  _id: string;
  userId: string;
  items: IInventoryItem[];
}
