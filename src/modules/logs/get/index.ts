import GetLogDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetLogDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { ILogEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Logs> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IGetLogDto, userId: string): Promise<ILogEntity[]> {
    const { lastId } = new GetLogDto(data);
    return this.rooster.getByUser(userId, lastId);
  }
}
