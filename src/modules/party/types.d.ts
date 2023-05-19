import type { IPartyEntity } from './entity';
import type mongoose from 'mongoose';

export interface IParty extends IPartyEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
