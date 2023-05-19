import mongoose from 'mongoose';
import type { IParty } from './types';

export const partySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, 'userId not provided'],
    unique: true,
  },
  characters: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
});

export default mongoose.model<IParty>('Party', partySchema);
