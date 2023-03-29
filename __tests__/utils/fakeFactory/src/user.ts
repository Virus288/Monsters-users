import type * as enums from '../../../../src/enums';
import TemplateFactory from './abstracts';
import type { EFakeData } from '../enums';
import User from '../../../../src/modules/user/model';
import { hashPassword } from '../../../../src/tools/token';
import type { IAbstractBody } from '../types/data';
import type { IUserEntity } from '../../../../src/modules/user/entity';

export default class FakeUser extends TemplateFactory<EFakeData.User> implements IAbstractBody<IUserEntity> {
  constructor() {
    super(User);
  }

  _id(id?: string): this {
    this.state._id = id;
    return this;
  }

  login(login?: string): this {
    this.state.login = login;
    return this;
  }

  email(email?: string): this {
    this.state.email = email;
    return this;
  }

  password(password?: string): this {
    if (password) this.state.password = hashPassword(password);
    return this;
  }

  type(type?: enums.EUserTypes): this {
    this.state.type = type;
    return this;
  }

  verified(verified?: boolean): this {
    this.state.verified = verified;
    return this;
  }

  protected fillState(): void {
    this.state = {
      _id: undefined,
      email: undefined,
      login: undefined,
      password: undefined,
      type: undefined,
      verified: false,
    };
  }
}
