import * as errors from '../../errors';
import * as enums from '../../enums';
import mongoose from 'mongoose';
import type { IAddProfileDto, IGetProfileDto } from './dto';

export default class Validator {
  static validateAddProfile(tempId: string, data: IAddProfileDto): void {
    const races = Object.values(enums.EUserRace);
    if (!data.race) throw new errors.MissingArgError(tempId, 'Race is missing');
    if (!races.includes(data.race)) throw new errors.IncorrectArgType(tempId, 'Race has incorrect type');
  }

  static validateUserId(tempId: string, data: IGetProfileDto): void {
    if (!data.id) throw new errors.MissingArgError(tempId, 'Id is missing');
    const isValid = mongoose.Types.ObjectId.isValid(data.id);
    if (!isValid) throw new errors.IncorrectArgError(tempId, 'Provided user id is invalid');
  }
}
