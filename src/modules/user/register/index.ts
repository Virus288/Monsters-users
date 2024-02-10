import RegisterDto from './dto';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import * as utils from '../utils';
import type { IRegisterDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async register(data: IRegisterDto): Promise<string> {
    const payload = new RegisterDto(data);

    const { email, password, login } = payload;
    const byEmail = await this.rooster.getByEmail(email);
    const byLogin = await this.rooster.getByLogin(login);

    if (byEmail ?? byLogin) {
      if (byLogin?.login === login) throw new errors.UsernameAlreadyInUseError();
      if (byEmail?.email === email) throw new errors.UserAlreadyRegisteredError();
    }

    const hashed = utils.hashPassword(password);
    return this.rooster.add({ ...payload, password: hashed });
  }
}
