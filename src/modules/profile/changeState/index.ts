import ChangeCharacterStatusDto from './dto';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IChangeCharacterStatusDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { ILocalUser } from '../../../types';

export default class Controller extends ControllerFactory<EModules.Profiles> {
  constructor() {
    super(new Rooster());
  }

  async changeState(data: IChangeCharacterStatusDto, user: ILocalUser): Promise<void> {
    const payload = new ChangeCharacterStatusDto(data);

    const exist = await this.rooster.getByUser(user.userId!);
    if (!exist) throw new errors.ProfileDoesNotExists();

    await this.rooster.update(exist._id, payload);
  }
}
