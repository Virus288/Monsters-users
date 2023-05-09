import type * as types from '../../types';
import Validator from './validation';
import * as errors from '../../errors';
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

  async getProfile(data: IGetProfileDto): Promise<IProfileEntity | null> {
    Validator.validateUserId(data);
    return this.rooster.get(data.id);
  }

  async addProfile(data: IAddProfileDto, user: types.ILocalUser): Promise<void> {
    Validator.validateAddProfile(data);
    const exist = await this.rooster.get(user.userId!);
    if (exist) throw new ProfileAlreadyExistsError();
    await this.rooster.add({ ...data, user: user.userId! });
  }

  async addBasicProfile(user: string): Promise<void> {
    return this.rooster.addDefault({ user });
  }

  async remove(userId: string): Promise<void> {
    const exist = await this.rooster.get(userId);
    if (!exist) throw new errors.UserDoesNotExist();
    await this.rooster.remove(exist._id);
  }
}
