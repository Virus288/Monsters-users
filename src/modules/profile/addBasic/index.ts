import AddBasicProfileDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddBasicProfileDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IProfileEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddBasicProfileDto): Promise<IProfileEntity> {
    const payload = new AddBasicProfileDto(data);
    return this.rooster.addDefault(payload);
  }
}
