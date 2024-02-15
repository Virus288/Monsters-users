import type mongoose from 'mongoose';

export interface IAddLogDto {
  message: string;
  userId: mongoose.Types.objectId;
}
