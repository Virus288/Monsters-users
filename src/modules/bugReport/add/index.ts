import AddLogDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddBugReport } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.BugReport> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddBugReport): Promise<void> {
    const payload = new AddLogDto(data);
    await this.rooster.add(payload);
  }
}
