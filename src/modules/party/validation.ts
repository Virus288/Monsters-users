import mongoose from 'mongoose';
import * as errors from '../../errors';
import type { ICreatePartyDto, IGetPartyDto } from './dto';

export default class Validator {
  static validateCreate(data: ICreatePartyDto): void {
    if (!data.leader) throw new errors.MissingArgError('leader');
    if (data.characters === undefined) throw new errors.MissingArgError('characters');

    const { leader, characters } = data;
    const isLeaverValid = mongoose.Types.ObjectId.isValid(leader);
    if (!isLeaverValid) throw new errors.IncorrectArgError('Provided Leader id is invalid');
    if (!Array.isArray(characters)) throw new errors.IncorrectArgError('Provided characters list is invalid');

    if (characters.length > 0) {
      characters.forEach((ch) => {
        const isCharacterValid = mongoose.Types.ObjectId.isValid(ch);
        if (!isCharacterValid) throw new errors.IncorrectArgError(`Character id ${ch} is invalid`);
      });
    }
  }

  static validateGet(data: IGetPartyDto): void {
    if (!data.id) throw new errors.MissingArgError('id');

    const { id } = data;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new errors.IncorrectArgError('Provided party id is invalid');
  }
}
