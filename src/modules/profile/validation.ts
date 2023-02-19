import type * as types from '../../types';
import * as errors from '../../errors';
import * as enums from '../../enums';
import mongoose from 'mongoose';

export default class Validator {
  static validateAddProfile(tempId: string, data: types.INewProfile): void {
    const races = Object.values(enums.EUserRace);
    if (!data.race) throw new errors.IncorrectProfile(tempId, 'Race is missing');
    if (!races.includes(data.race)) throw new errors.IncorrectProfile(tempId, 'Race has incorrect type');
  }

  static validateUserId(tempId: string, data: types.IUserId): void {
    if (!data.id) throw new errors.IncorrectCredentials(tempId, 'Provided user id is missing');
    const isValid = mongoose.Types.ObjectId.isValid(data.id);
    if (!isValid) throw new errors.IncorrectCredentials(tempId, 'Provided user id is invalid');
  }
}
