import mongoose from 'mongoose';
import type { ICharacter } from './types';
import * as enums from '../../enums';

export const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'character name not provided'],
  },
  race: {
    type: String,
    enum: enums.EUserRace,
    required: [true, 'race not provided'],
    default: enums.EUserRace.Human,
  },
  lvl: {
    type: Number,
    required: false,
    default: 1,
  },
  exp: {
    type: [Number, Number],
    required: false,
    default: [0, 10],
  },
  inventory: {
    type: mongoose.Types.ObjectId,
    required: [true, 'inventory not provided'],
  },
  party: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
});

export default mongoose.model<ICharacter>('Character', characterSchema);
