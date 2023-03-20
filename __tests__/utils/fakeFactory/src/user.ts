import * as enums from '../../../../src/enums';
import TemplateFactory from './abstracts';
import { EFakeData } from '../enums';
import User from '../../../../src/modules/user/model';
import { hashPassword } from '../../../../src/tools/token';

export default class FakeUser extends TemplateFactory<EFakeData.User> {
  constructor() {
    super();
    this.target = User;
    this.fillState();
  }

  login(login: string): this {
    this.state.login = login;
    return this;
  }

  email(email: string): this {
    this.state.email = email;
    return this;
  }

  password(password: string): this {
    this.state.password = hashPassword(password);
    return this;
  }

  type(type: enums.EUserTypes): this {
    this.state.type = type;
    return this;
  }

  verified(verified: boolean): this {
    this.state.verified = verified;
    return this;
  }

  private fillState(): void {
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
