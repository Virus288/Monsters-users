import TemplateFactory from './abstracts';
import User from '../../../../src/modules/user/model';
import { hashPassword } from '../../../../src/modules/user/utils';
import type * as enums from '../../../../src/enums';
import type { IUserEntity } from '../../../../src/modules/user/entity';
import type { EFakeData } from '../enums';
import type { IAbstractBody } from '../types/data';

export default class FakeUser extends TemplateFactory<EFakeData.User> implements IAbstractBody<IUserEntity> {
  constructor() {
    super(User);
  }

  _id(id?: string): this {
    this.data._id = id;
    return this;
  }

  login(login?: string): this {
    this.data.login = login;
    return this;
  }

  email(email?: string): this {
    this.data.email = email;
    return this;
  }

  password(password?: string): this {
    if (password) this.data.password = hashPassword(password);
    return this;
  }

  type(type?: enums.EUserTypes): this {
    this.data.type = type;
    return this;
  }

  verified(verified?: boolean): this {
    this.data.verified = verified;
    return this;
  }

  protected override fillState(): void {
    this.data = {
      _id: undefined,
      email: undefined,
      login: undefined,
      password: undefined,
      type: undefined,
      verified: false,
    };
  }
}
