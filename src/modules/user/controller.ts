import type { ILocalUser, IUserCredentials } from '../../types';
import Rooster from './rooster';
import * as errors from '../../errors';
import Validator from './validation';
import * as utils from '../../tools/token';
import type { ILoginDto, IRegisterDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async login(payload: ILoginDto, user: ILocalUser): Promise<IUserCredentials> {
    try {
      Validator.validateLogin(user.tempId, payload);
    } catch (err) {
      throw new errors.IncorrectCredentialsError(user.tempId);
    }

    const { login, password } = payload;
    const users = await this.rooster.get(login);
    if (!users || users.length === 0) throw new errors.IncorrectCredentialsError(user.tempId);

    const target = users[0];
    await Validator.compare(user.tempId, password, target.password);

    const accessToken = utils.generateAccessToken(target._id.toString(), target.type);
    const refreshToken = utils.generateRefreshToken(target._id.toString(), target.type);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: target._id.toString(),
    };
  }

  async register(payload: IRegisterDto, user: ILocalUser): Promise<void> {
    Validator.validateRegister(user.tempId, payload);

    const { email, password, login } = payload;
    const users = await this.rooster.get(email);
    if (users && users.length > 0) {
      users.forEach((u) => {
        if (u.login === login) throw new errors.UsernameAlreadyInUseError(user.tempId);
        if (u.email === email) throw new errors.UserAlreadyRegisteredError(user.tempId);
      });
    }

    const hashed = utils.hashPassword(password);

    await this.rooster.add({ ...payload, password: hashed });
  }
}
