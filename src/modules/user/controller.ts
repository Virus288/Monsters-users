import Rooster from './rooster';
import Validator from './validation';
import * as errors from '../../errors';
import ControllerFactory from '../../tools/abstract/controller';
import State from '../../tools/state';
import * as utils from '../../tools/token';
import type { ILoginDto, IRegisterDto, IUserDetailsDto } from './dto';
import type { IUserEntity } from './entity';
import type { EModules } from '../../tools/abstract/enums';
import type { IUserCredentials } from '../../types';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async login(payload: ILoginDto): Promise<IUserCredentials> {
    try {
      Validator.validateLogin(payload);
    } catch (err) {
      throw new errors.IncorrectCredentialsError();
    }

    const { login, password } = payload;
    const user = await this.rooster.getByLogin(login);
    if (!user) throw new errors.IncorrectCredentialsError();

    await Validator.compare(password, user.password);

    const accessToken = utils.generateAccessToken(user._id.toString(), user.type);
    const refreshToken = utils.generateRefreshToken(user._id.toString(), user.type);

    return {
      accessToken,
      refreshToken,
      userId: user._id.toString(),
    };
  }

  async register(payload: IRegisterDto): Promise<string> {
    Validator.validateRegister(payload);

    const { email, password, login } = payload;
    const byEmail = await this.rooster.getByEmail(email);
    const byLogin = await this.rooster.getByLogin(login);

    if (byEmail || byLogin) {
      if (byLogin?.login === login) throw new errors.UsernameAlreadyInUseError();
      if (byEmail?.email === email) throw new errors.UserAlreadyRegisteredError();
    }

    const hashed = utils.hashPassword(password);
    const id = await this.rooster.add({ ...payload, password: hashed });

    const user = await State.Redis.getRemovedUsers(id);
    if (user) await State.Redis.removeRemovedUser(id);
    return id;
  }

  async getDetails(payload: IUserDetailsDto): Promise<IUserEntity | null> {
    Validator.validateGetDetails(payload);
    if (payload.id) return this.rooster.get(payload.id);
    if (payload.name) return this.rooster.getByLogin(payload.name);
    return null;
  }

  async remove(id: string): Promise<void> {
    await this.rooster.remove(id);
  }
}
