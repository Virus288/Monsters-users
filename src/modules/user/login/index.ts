import LoginDto from './dto';
import Utils from './utils';
import * as errors from '../../../errors';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { ILoginDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IUserCredentials } from '../../../types';

export default class Controller extends ControllerFactory<EModules.Users> {
  private readonly _utils: Utils;

  constructor() {
    super(new Rooster());
    this._utils = new Utils();
  }

  private get utils(): Utils {
    return this._utils;
  }

  async login(data: ILoginDto): Promise<IUserCredentials> {
    const payload = new LoginDto(data);
    const { login, password } = payload;
    const user = await this.rooster.getByLogin(login);
    if (!user) throw new errors.IncorrectCredentialsError();

    await this.utils.compare(password, user.password);

    return {
      id: user._id.toString(),
    };
  }
}
