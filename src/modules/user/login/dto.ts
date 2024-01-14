import Validation from '../../../tools/validation';
import type { ILoginDto } from './types';

export default class LoginDto implements ILoginDto {
  login: string;
  password: string;

  constructor(data: ILoginDto) {
    this.login = data.login;
    this.password = data.password;

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
        new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/u, 'u'),
        'password should contain min. 8 characters with at least 1 digit, 1 letter, 1 upper case letter and 1 lower case letter',
      );
  }
}
