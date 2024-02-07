import GetController from './get';
import GetAllController from './getAll';
import LoginController from './login';
import RegisterController from './register';
import RemoveController from './remove';
import RemoveUserDto from './remove/dto';
import * as enums from '../../enums';
import * as errors from '../../errors';
import HandlerFactory from '../../tools/abstract/handler';
import State from '../../tools/state';
import type { IUserDetails } from './entity';
import type { IUserDetailsDto } from './get/types';
import type { IGetAllUsersDto } from './getAll/types';
import type { ILoginDto } from './login/types';
import type { IRegisterDto } from './register/types';
import type { EModules } from '../../tools/abstract/enums';
import type { ILocalUser } from '../../types';

export default class UserHandler extends HandlerFactory<EModules.Users> {
  private readonly _removeController: RemoveController;
  private readonly _loginController: LoginController;
  private readonly _addController: RegisterController;
  private readonly _getAllController: GetAllController;

  constructor() {
    super(new GetController());
    this._removeController = new RemoveController();
    this._loginController = new LoginController();
    this._addController = new RegisterController();
    this._getAllController = new GetAllController();
  }

  private get addController(): RegisterController {
    return this._addController;
  }

  private get getAllController(): GetAllController {
    return this._getAllController;
  }

  private get removeController(): RemoveController {
    return this._removeController;
  }

  private get loginController(): LoginController {
    return this._loginController;
  }

  async login(payload: unknown, user: ILocalUser): Promise<void> {
    try {
      const callback = await this.loginController.login(payload as ILoginDto);
      return State.broker.send(user.tempId, callback, enums.EMessageTypes.Credentials);
    } catch (err) {
      throw new errors.IncorrectCredentialsError();
    }
  }

  async register(payload: IRegisterDto): Promise<string> {
    return this.addController.register(payload);
  }

  async getDetails(payload: unknown, user: ILocalUser): Promise<void> {
    const callback = await this.getController.get(payload as IUserDetailsDto[]);
    return State.broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async getAll(payload: unknown, user: ILocalUser): Promise<void> {
    const callback = await this.getAllController.getAll(payload as IGetAllUsersDto);
    return State.broker.send(user.tempId, callback, enums.EMessageTypes.Send);
  }

  async remove(name: string, userId: string): Promise<IUserDetails> {
    const data = new RemoveUserDto({ name });
    const users = await this.getController.get([data]);
    if (users.length === 0) throw new errors.NoPermission();

    const user = users[0] as IUserDetails;
    if (user._id.toString() !== userId) throw new errors.NoPermission();

    await this.removeController.remove(user._id);
    await State.redis.addRemovedUser(name, userId);
    return user;
  }
}
