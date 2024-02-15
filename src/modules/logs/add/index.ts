import AddLogDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddLogDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Logs> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddLogDto, userId: string): Promise<{ _id: string }> {
    const payload = new AddLogDto({ ...data, userId });

    return { _id: await this.rooster.add(payload) };
  }
}
