import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import * as errors from '../../errors';
import type { ILoginDto, IRegisterDto, IRemoveUserDto, IUserDetailsDto } from './dto';

export default class Validator {
  static validateRegister(data: IRegisterDto): void {
    Validator.validateEmail(data.email?.trim());
    Validator.validatePassword(data.password);
    Validator.validateUserName(data.login?.trim());
  }

  static validateLogin(data: ILoginDto): void {
    Validator.validateUserName(data.login);
    Validator.validatePassword(data.password);
  }

  static validateRemove(data: IRemoveUserDto): void {
    if (!data.name) throw new errors.MissingArgError('name');
    if (typeof data.name !== 'string') throw new errors.IncorrectArgTypeError('Name is not string');
  }

  static validateGetDetails(data: IUserDetailsDto): void {
    if (!data.name) {
      if (!data.id) throw new errors.MissingArgError('id');
      const isValid = mongoose.Types.ObjectId.isValid(data.id);
      if (!isValid) throw new errors.IncorrectArgError('Provided user id is invalid');
    }
    if (!data.id) {
      if (!data.name) throw new errors.MissingArgError('name');
      if (typeof data.name !== 'string') throw new errors.IncorrectArgTypeError('Name is not string');
    }

    if (data.id && data.name) {
      const isValid = mongoose.Types.ObjectId.isValid(data.id);
      if (!isValid) throw new errors.IncorrectArgError('Provided user id is invalid');

      if (typeof data.name !== 'string') throw new errors.IncorrectArgTypeError('Name is not string');
    }
  }

  static validateEmail(email: string): void {
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/u, 'u');
    const isEmail = regex.test(email);

    if (!email) throw new errors.MissingArgError('email');
    if (!isEmail) throw new errors.IncorrectArgTypeError('Not valid email address');
    if (email.length > 200) {
      throw new errors.IncorrectArgLengthError('email', undefined, 200);
    }
  }

  static validatePassword(password: string): void {
    const regex = new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/u, 'u');
    const isPassword = regex.test(password);

    if (!password) throw new errors.MissingArgError('password');

    if (password.length < 6 || password.length > 200) {
      throw new errors.IncorrectArgLengthError('password', 6, 200);
    }
    if (!isPassword) {
      throw new errors.IncorrectArgTypeError(
        'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
      );
    }
  }

  static validateUserName(name: string): void {
    if (!name) throw new errors.MissingArgError('login');

    const regex = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/u, 'u');
    const isIncorrect = regex.test(name);
    if (!isIncorrect)
      throw new errors.IncorrectArgTypeError(
        'login should only contain arabic letters, numbers and special characters',
      );
    if (name.length < 3 || name.length > 30) throw new errors.IncorrectArgLengthError('login', 3, 30);
  }

  static async compare(password: string, hashed: string): Promise<void> {
    const auth = await bcrypt.compare(password, hashed);
    if (!auth) throw new errors.IncorrectCredentialsError();
  }
}
