import * as errors from '../../errors';
import * as enums from '../../enums';
import mongoose from 'mongoose';
import type { IAddProfileDto, IGetProfileDto } from './dto';

export default class Validator {
  static validateAddProfile(data: IAddProfileDto): void {
    const races = Object.values(enums.EUserRace);
    if (!data.race) throw new errors.MissingArgError('Race is missing');
    if (!races.includes(data.race)) throw new errors.IncorrectArgType('Race has incorrect type');
  }

  static validateUserId(data: IGetProfileDto): void {
    if (!data.id) throw new errors.MissingArgError('Id is missing');
    const isValid = mongoose.Types.ObjectId.isValid(data.id);
    if (!isValid) throw new errors.IncorrectArgError('Provided user id is invalid');
  }
}
