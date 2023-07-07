import Validation from '../../../tools/validation';
import type { IRegisterDto } from './types';

export default class RegisterDto implements IRegisterDto {
  login: string;
  password: string;
  email: string;

  constructor(data: IRegisterDto) {
    this.login = data.login;
    this.password = data.password;
    this.email = data.email;

    this.validate();
  }

  validate(): void {
    new Validation(this.login, 'login')
      .isDefined()
      .isString()
      .hasLength(30, 3)
      .isRegexCompatible(
        new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/u, 'u'),
        'login should only contain arabic letters, numbers and special characters',
      );

    new Validation(this.password, 'password')
      .isDefined()
      .isString()
      .hasLength(200, 6)
      .isRegexCompatible(
        new RegExp(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[\W_])(?!\S*\s)[a-zA-Z0-9\W_]{8,}/u, 'u'),
        'password should contain at least 8 characters with: at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
      );

    new Validation(this.email, 'email')
      .isDefined()
      .isString()
      .hasLength(200)
      .isRegexCompatible(
        new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/u, 'u'),
        'email invalid',
      );
  }
}
