import Log from '../../modules/logs/model';
import type { QueryWithHelpers, UpdateWriteOpResult } from 'mongoose';

export default {
  async up(): Promise<QueryWithHelpers<UpdateWriteOpResult, unknown, unknown, unknown, 'updateMany'>> {
    return Log.updateMany({ target: { $exists: false } }, { $set: { target: '' } });
  },

  async down(): Promise<void> {
    await Log.updateMany({}, { $unset: { target: 1 } });
  },
};
