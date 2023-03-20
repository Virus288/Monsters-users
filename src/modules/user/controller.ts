import type * as types from '../../types';
import Rooster from './rooster';
import * as errors from '../../errors';
import Validator from './validation';
import * as utils from '../../tools/token';

export default class Controller {
  constructor() {
    this.rooster = new Rooster();
  }

  private _rooster: Rooster;

  private get rooster(): Rooster {
    return this._rooster;
  }

  private set rooster(value: Rooster) {
    this._rooster = value;
  }

  async login(payload: types.ILoginReq, user: types.ILocalUser): Promise<types.IUserCredentials> {
    try {
      Validator.validateLogin(user.tempId, payload);
    } catch (err) {
      throw new errors.IncorrectLogin(user.tempId);
    }

    const { login, password } = payload;
    const users = await this.rooster.get(login);
    if (!users || users.length === 0) throw new errors.IncorrectLogin(user.tempId);

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

  async register(payload: types.IRegisterReq, user: types.ILocalUser): Promise<void> {
    Validator.validateRegister(user.tempId, payload);

    const { email, password, login } = payload;
    const users = await this.rooster.get(email);
    if (users && users.length > 0) {
      users.forEach((u) => {
        if (u.login === login) throw new errors.UsernameAlreadyInUse(user.tempId);
        if (u.email === email) throw new errors.UserAlreadyRegistered(user.tempId);
      });
    }

    const hashed = utils.hashPassword(password);

    await this.rooster.add({ ...payload, password: hashed });
  }
}
