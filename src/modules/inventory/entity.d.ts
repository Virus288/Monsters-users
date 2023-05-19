import type { IInventoryItem } from './types';

export interface IInventoryEntity {
  _id: string;
  items: IInventoryItem[];
}
