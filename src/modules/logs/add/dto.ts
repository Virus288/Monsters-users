import mongoose from 'mongoose';
import Validation from '../../../tools/validation';
import type { IAddLogDto } from './types';

export default class AddLogDto implements IAddLogDto {
  message: string;
  userId: mongoose.Types.ObjectId;
  target: string;

  constructor(data: IAddLogDto) {
    this.message = data.message;
    this.target = data.target;
    this.userId = new mongoose.Types.ObjectId(String(data.userId));

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined().isString().hasLength(200);
    new Validation(this.userId, 'userId').isDefined().isObjectId();
    new Validation(this.target, 'target').isDefined().isString();
  }
}
