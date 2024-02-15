import mongoose from 'mongoose';
import Validation from '../../../tools/validation';
import type { IAddLogDto } from './types';

export default class AddLogDto implements IAddLogDto {
  message: string;
  userId: mongoose.Types.ObjectId;

  constructor(data: IAddLogDto) {
    this.message = data.message;
    this.userId = new mongoose.Types.ObjectId(String(data.userId));

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined().isString().hasLength(200);
  }
}
