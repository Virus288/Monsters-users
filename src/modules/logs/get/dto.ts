import Validation from '../../../tools/validation';
import type { IGetLogDto } from './types';

export default class GetLogDto implements IGetLogDto {
  lastId?: string;

  constructor(data: IGetLogDto) {
    this.lastId = data.lastId;

    this.validate();
  }

  private validate(): void {
    if (this.lastId) {
      new Validation(this.lastId, 'lastId').isDefined().isString().isObjectId();
    }
  }
}
