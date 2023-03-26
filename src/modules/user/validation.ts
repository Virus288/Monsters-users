import bcrypt from 'bcrypt';
import * as errors from '../../errors';
import type { ILoginDto, IRegisterDto } from './dto';

export default class Validator {
  static validateRegister(tempId: string, data: IRegisterDto): void {
    Validator.validateEmail(tempId, data.email?.trim());
    Validator.validatePassword(tempId, data.password);
    Validator.validateUserName(tempId, data.login?.trim());
  }

  static validateLogin(tempId: string, data: ILoginDto): void {
    Validator.validateUserName(tempId, data.login);
    Validator.validatePassword(tempId, data.password);
  }

  static validateEmail(tempId: string, email: string): void {
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    const isEmail = regex.test(email);

    if (!email) throw new errors.IncorrectArgError(tempId, 'email missing');
    if (!isEmail) throw new errors.IncorrectArgType(tempId, 'Not valid email address');
    if (email.length > 200) {
      throw new errors.IncorrectArgLengthError(tempId, 'email', undefined, 200);
    }
  }

  static validatePassword(tempId: string, password: string): void {
    const regex = new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/);
    const isPassword = regex.test(password);

    if (!password) throw new errors.IncorrectArgError(tempId, 'password missing');

    if (password.length < 6 || password.length > 200) {
      throw new errors.IncorrectArgLengthError(tempId, 'password', 6, 200);
    }
    if (!isPassword) {
      throw new errors.IncorrectArgType(
        tempId,
        'password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
      );
    }
  }

  static validateUserName(tempId: string, name: string): void {
    const regex = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/);
    const isIncorrect = regex.test(name);

    if (!name) throw new errors.IncorrectArgError(tempId, 'login missing');

    if (!isIncorrect)
      throw new errors.IncorrectArgType(
        tempId,
        'login should only contain arabic letters, numbers and special characters',
      );
    if (name.length < 3 || name.length > 30) throw new errors.IncorrectArgLengthError(tempId, 'login', 3, 30);
  }

  static async compare(tempId: string, password: string, hashed: string): Promise<void> {
    const auth = await bcrypt.compare(password, hashed);
    if (!auth) throw new errors.IncorrectCredentialsError(tempId);
  }
}
