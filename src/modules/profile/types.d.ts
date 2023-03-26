import type { IAddProfileDto } from './dto';
import type mongoose from 'mongoose';

export interface IProfile extends IAddProfileDto, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
