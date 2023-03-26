import type mongoose from 'mongoose';
import type { IUserEntity } from './entity';

export interface IUser extends IUserEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
