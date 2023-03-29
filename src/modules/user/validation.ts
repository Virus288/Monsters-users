import bcrypt from 'bcrypt';
import * as errors from '../../errors';
import type { ILoginDto, IRegisterDto } from './dto';

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

  static validateEmail(email: string): void {
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/u, 'u');
    const isEmail = regex.test(email);

    if (!email) throw new errors.IncorrectArgError('email missing');
    if (!isEmail) throw new errors.IncorrectArgType('Not valid email address');
    if (email.length > 200) {
      throw new errors.IncorrectArgLengthError('email', undefined, 200);
    }
  }

  static validatePassword(password: string): void {
    const regex = new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/u, 'u');
    const isPassword = regex.test(password);

    if (!password) throw new errors.IncorrectArgError('password missing');

    if (password.length < 6 || password.length > 200) {
      throw new errors.IncorrectArgLengthError('password', 6, 200);
    }
    if (!isPassword) {
      throw new errors.IncorrectArgType(
        'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
      );
    }
  }

  static validateUserName(name: string): void {
    const regex = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/u, 'u');
    const isIncorrect = regex.test(name);

    if (!name) throw new errors.IncorrectArgError('login missing');

    if (!isIncorrect)
      throw new errors.IncorrectArgType('login should only contain arabic letters, numbers and special characters');
    if (name.length < 3 || name.length > 30) throw new errors.IncorrectArgLengthError('login', 3, 30);
  }

  static async compare(tempId: string, password: string, hashed: string): Promise<void> {
    const auth = await bcrypt.compare(password, hashed);
    if (!auth) throw new errors.IncorrectCredentialsError(tempId);
  }
}
