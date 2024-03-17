import mongoose from 'mongoose';
import type { IBugReport } from './types';

export const bugReportSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      minlength: [1, 'Min length is 1 characters'],
      maxlength: [200, 'Max name length is 200 characters'],
    },
    user: {
      type: String,
      required: [true, 'sender not provided'],
    },
  },
  { timestamps: true },
);

const Log = mongoose.model<IBugReport>('BugReport', bugReportSchema);
export default Log;
