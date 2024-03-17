import type { IBugReportEntity } from './entity';
import type mongoose from 'mongoose';

export interface IBugReport extends IBugReportEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
