import UserDetailsDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IUserDetailsDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IUserEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IUserDetailsDto): Promise<IUserEntity | null> {
    const payload = new UserDetailsDto(data);

    if (payload.id) return this.rooster.get(payload.id);
    if (payload.name) return this.rooster.getByLogin(payload.name);
    return null;
  }
}
