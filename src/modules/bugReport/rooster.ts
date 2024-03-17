import BugReport from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IBugReportEntity } from './entity';
import type { IBugReport } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IBugReport, typeof BugReport, EModules.BugReport> {
  constructor() {
    super(BugReport);
  }

  async getAll(page: number): Promise<IBugReportEntity[]> {
    return this.model
      .find()
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }
}
