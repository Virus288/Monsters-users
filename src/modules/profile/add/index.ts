import AddProfileDto from './dto';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IAddProfileDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { ILocalUser } from '../../../types';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async add(data: IAddProfileDto, user: ILocalUser): Promise<void> {
    const payload = new AddProfileDto(data);

    const exist = await this.rooster.getByUser(user.userId!);
    if (!exist) throw new errors.ProfileDoesNotExists();
    if (exist.initialized) throw new errors.ProfileAlreadyInitializedError();
    await this.rooster.update(exist._id, { ...payload, race: payload.race, initialized: true });
  }
}
