import mongoose from 'mongoose';
import type { ILog } from './types';

export const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      minlength: [1, 'Min length is 1 characters'],
      maxlength: [200, 'Max name length is 200 characters'],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'userId not provided'],
    },
  },
  { timestamps: true },
);

const Log = mongoose.model<ILog>('Log', logSchema);
export default Log;
