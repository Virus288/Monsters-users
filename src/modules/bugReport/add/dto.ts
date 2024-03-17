import mongoose from 'mongoose';
import Validation from '../../../tools/validation';
import type { IAddBugReport } from './types';

export default class AddBugReport implements IAddBugReport {
  message: string;
  user: mongoose.Types.ObjectId;

  constructor(data: IAddBugReport) {
    this.message = data.message;
    this.user = new mongoose.Types.ObjectId(String(data.user));

    this.validate();
  }

  validate(): void {
    new Validation(this.message, 'message').isDefined().isString().hasLength(300);
    new Validation(this.user, 'user').isDefined().isObjectId();
  }
}
