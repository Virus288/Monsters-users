import mongoose from 'mongoose';
import type * as type from '../../types';
import * as enums from '../../enums';

export const profileSchema = new mongoose.Schema({
  race: {
    type: String,
    enum: enums.EUserRace,
    required: [true, 'Race not provided'],
  },
  friends: {
    type: [mongoose.Types.ObjectId],
    enum: enums.EUserRace,
    required: false,
    default: [],
  },
  lvL: {
    type: Number,
    required: false,
    default: 1,
  },
  exp: {
    type: [Number, Number],
    required: false,
    default: [0, 10],
  },
});

const Profile = mongoose.model<type.IProfile>('Profile', profileSchema);
export default Profile;
