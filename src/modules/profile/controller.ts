import Rooster from './rooster';
import Validator from './validation';
import * as errors from '../../errors';
import { ProfileDoesNotExists } from '../../errors';
import ControllerFactory from '../../tools/abstract/controller';
import type { IAddProfileDto, IGetProfileDto } from './dto';
import type { IProfileEntity } from './entity';
import type { EModules } from '../../tools/abstract/enums';
import type * as types from '../../types';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async getProfile(data: IGetProfileDto): Promise<IProfileEntity | null> {
    Validator.validateUserId(data);
    return this.rooster.getByUser(data.id);
  }

  async addProfile(data: IAddProfileDto, user: types.ILocalUser): Promise<void> {
    Validator.validateAddProfile(data);
    const exist = await this.rooster.getByUser(user.userId!);
    if (!exist) throw new ProfileDoesNotExists();
    await this.rooster.update(exist._id, { ...data, race: data.race });
  }

  async addBasicProfile(user: string, party: string, inventory: string): Promise<IProfileEntity> {
    return this.rooster.addDefault({ user, party, inventory });
  }

  async remove(userId: string): Promise<void> {
    const exist = await this.rooster.getByUser(userId);
    if (!exist) throw new errors.UserDoesNotExist();
    await this.rooster.remove(exist._id);
  }
}
