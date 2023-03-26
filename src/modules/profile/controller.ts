import type * as types from '../../types';
import Validator from './validation';
import { ProfileAlreadyExistsError } from '../../errors';
import type { IProfileEntity } from './entity';
import type { IAddProfileDto, IGetProfileDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import Rooster from './rooster';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async getProfile(data: IGetProfileDto, user: types.ILocalUser): Promise<IProfileEntity> {
    Validator.validateUserId(user.tempId, data);
    return await this.rooster.get(data.id);
  }

  async addProfile(data: IAddProfileDto, user: types.ILocalUser): Promise<void> {
    Validator.validateAddProfile(user.userId, data);
    const exist = await this.rooster.get(user.userId);
    if (exist) throw new ProfileAlreadyExistsError(user.tempId);
    return await this.rooster.add(data);
  }
}
