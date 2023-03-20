import type mongoose from 'mongoose';
import type * as enums from '../enums';

export interface IProfile extends IProfileLean, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IProfileLean {
  _id: string;
  user: string;
  race: enums.EUserRace;
  friends: string[];
  lvl: number;
  exp: [number, number];
}

export interface INewProfileReq {
  race: enums.EUserRace;
}

export interface INewProfile {
  race: enums.EUserRace;
  user: string;
}
