import Validation from '../../../tools/validation';
import type { IGetBugReport } from './types';

export default class GetBugReport implements IGetBugReport {
  page: number;

  constructor(data: IGetBugReport) {
    this.page = data.page;

    this.validate();
  }

  validate(): void {
    new Validation(this.page, 'page').isDefined().isNumber().hasLength(1000, 1);
  }
}
