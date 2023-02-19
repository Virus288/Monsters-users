import { IUserLean } from '../../../src/types';
import * as enums from '../../../src/enums';
import User from '../../../src/modules/user/model';
import { hashPassword } from '../../../src/tools/token';
import mongoose from 'mongoose';

export default class FakeUser {
  state: IUserLean = {
    _id: undefined,
    email: undefined,
    login: undefined,
    password: undefined,
    type: undefined,
    verified: false,
  };

  login(login: string): this {
    this.state.login = login;
    return this;
  }

  email(email: string): this {
    this.state.email = email;
    return this;
  }

  password(password: string): this {
    this.state.password = password;
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

  async create(): Promise<mongoose.Types.ObjectId> {
    this.state.password = await hashPassword(this.state.password);

    const NewUser = new User(this.state);
    const user = await NewUser.save();
    return user._id;
  }

  clean(): void {
    this.state = {
      _id: undefined,
      email: undefined,
      login: undefined,
      password: undefined,
      type: undefined,
      verified: false,
    };
  }

  async cleanUp(): Promise<void> {
    await User.findOneAndDelete({ email: this.state.email });
    this.clean();
  }
}
