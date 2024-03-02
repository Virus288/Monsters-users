import { ECharacterState } from '../../enums';
import Profile from '../../modules/profile/model';
import type { QueryWithHelpers, UpdateWriteOpResult } from 'mongoose';

export default {
  async up(): Promise<QueryWithHelpers<UpdateWriteOpResult, unknown, unknown, unknown, 'updateMany'>> {
    return Profile.updateMany({ state: { $exists: false } }, { $set: { state: ECharacterState.Map } });
  },

  async down(): Promise<void> {
    await Profile.updateMany({}, { $unset: { state: 1 } });
  },
};
