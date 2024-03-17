import GetBugReport from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetBugReport } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IBugReportEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.BugReport> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IGetBugReport): Promise<IBugReportEntity[]> {
    const payload = new GetBugReport(data);

    return this.rooster.getAll(payload.page);
  }
}
