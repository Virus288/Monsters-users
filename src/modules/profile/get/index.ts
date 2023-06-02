import GetProfileDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetProfileDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IProfileEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IGetProfileDto): Promise<IProfileEntity | null> {
    const { id } = new GetProfileDto(data);
    return this.rooster.getByUser(id);
  }
}
