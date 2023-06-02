import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async remove(id: string): Promise<void> {
    await this.rooster.remove(id);
  }
}
