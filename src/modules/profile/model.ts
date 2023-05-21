import mongoose from 'mongoose';
import * as enums from '../../enums';
import type { IProfile } from './types';

export const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, 'userId not provided'],
    unique: true,
  },
  race: {
    type: String,
    enum: enums.EUserRace,
    required: [true, 'Race not provided'],
    default: enums.EUserRace.Human,
  },
  friends: {
    type: [String],
    required: false,
    default: [],
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
  initialized: {
    type: Boolean,
    required: false,
    default: false,
  },
  inventory: {
    type: mongoose.Types.ObjectId,
    required: [true, 'inventory not provided'],
  },
  party: {
    type: mongoose.Types.ObjectId,
    required: [true, 'party not provided'],
  },
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;
