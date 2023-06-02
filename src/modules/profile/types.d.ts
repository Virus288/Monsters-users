import type { IAddProfileDto } from './add/types';
import type mongoose from 'mongoose';

export interface IProfile extends IAddProfileDto, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
