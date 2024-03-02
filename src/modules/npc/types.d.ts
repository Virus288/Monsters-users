import type { ICharacterEntity } from './entity';
import type mongoose from 'mongoose';

export interface ICharacter extends ICharacterEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
