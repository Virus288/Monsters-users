import type mongoose from 'mongoose';

export interface IAddBugReport {
  message: string;
  user: mongoose.Types.objectId;
}
