import mongoose from 'mongoose';
import * as enums from '../enums';

export interface IProfile extends IProfileLean, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IProfileLean {
  _id: string;
  race: enums.EUserRace;
  friends: string[];
  lvL: [number, number];
  exp: number;
}

export interface INewProfile {
  race: enums.EUserRace;
}
