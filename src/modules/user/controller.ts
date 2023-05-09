import type { IUserCredentials } from '../../types';
import Rooster from './rooster';
import * as errors from '../../errors';
import Validator from './validation';
import * as utils from '../../tools/token';
import type { ILoginDto, IRegisterDto, IUserDetailsDto } from './dto';
import ControllerFactory from '../../tools/abstract/controller';
import type { EModules } from '../../tools/abstract/enums';
import type { IUserEntity } from './entity';
import State from '../../tools/state';

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
    const users = await this.rooster.get(login);
    if (!users || users.length === 0) throw new errors.IncorrectCredentialsError();

    const target = users[0]!;
    await Validator.compare(password, target.password);

    const accessToken = utils.generateAccessToken(target._id.toString(), target.type);
    const refreshToken = utils.generateRefreshToken(target._id.toString(), target.type);

    return {
      accessToken,
      refreshToken,
      userId: target._id.toString(),
    };
  }

  async register(payload: IRegisterDto): Promise<void> {
    Validator.validateRegister(payload);

    const { email, password, login } = payload;
    const users = await this.rooster.get(email);
    if (users && users.length > 0) {
      users.forEach((u) => {
        if (u.login === login) throw new errors.UsernameAlreadyInUseError();
        if (u.email === email) throw new errors.UserAlreadyRegisteredError();
      });
    }

    const hashed = utils.hashPassword(password);
    await this.rooster.add({ ...payload, password: hashed });

    await State.Redis.removeRemovedUser(payload.login);
  }

  async getDetails(payload: IUserDetailsDto): Promise<IUserEntity | null> {
    Validator.validateGetDetails(payload);
    if (payload.id) return this.rooster.getById(payload.id);
    if (payload.name) return this.rooster.getByLogin(payload.name);
    return null;
  }

  async remove(id: string): Promise<void> {
    await this.rooster.remove(id);
  }
}
