// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
  userId: string;
}

export class InternalError extends FullError {
  constructor() {
    super('InternalError');
    this.message = 'Internal error. Try again later';
    this.name = 'InternalError';
    this.code = '001';
    this.status = 500;
  }
}

export class NotFoundError extends FullError {
  constructor(userId: string) {
    super('NotFoundError');
    this.message = 'Resource not found';
    this.name = 'NotFoundError';
    this.code = '002';
    this.status = 404;
    this.userId = userId;
  }
}

export class UnauthorizedError extends FullError {
  constructor(userId: string) {
    super('UnauthorizedError');
    this.message = 'User not logged in';
    this.name = 'UnauthorizedError';
    this.code = '003';
    this.status = 401;
    this.userId = userId;
  }
}

export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('MissingProcessPlatformError');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatformError';
    this.code = '004';
    this.status = 500;
  }
}

export class UserDoesNotExistError extends FullError {
  constructor(userId: string) {
    super('UserDoesNotExistError');
    this.message = 'User does not exist';
    this.name = 'UserDoesNotExistError';
    this.code = '005';
    this.status = 400;
    this.userId = userId;
  }
}

export class MissingArgError extends FullError {
  constructor(userId: string, param: string) {
    super('MissingArgError');
    this.message = `Missing param: ${param}`;
    this.name = 'MissingArgError';
    this.code = '007';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectArgError extends FullError {
  constructor(userId: string, err: string) {
    super('IncorrectArgError');
    this.message = err;
    this.name = 'IncorrectArgError';
    this.code = '008';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectArgType extends FullError {
  constructor(userId: string, err: string) {
    super('IncorrectArgType');
    this.message = err;
    this.name = 'IncorrectArgType';
    this.code = '009';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectCredentialsError extends FullError {
  constructor(userId: string, message?: string) {
    super('IncorrectCredentialsError');
    this.message = message ?? 'Incorrect credentials';
    this.name = 'IncorrectCredentialsError';
    this.code = '010';
    this.status = 400;
    this.userId = userId;
  }
}

export class UserAlreadyRegisteredError extends FullError {
  constructor(userId: string) {
    super('UserAlreadyRegisteredError');
    this.message = 'Email already registered';
    this.name = 'UserAlreadyRegisteredError';
    this.code = '011';
    this.status = 400;
    this.userId = userId;
  }
}

export class UsernameAlreadyInUseError extends FullError {
  constructor(userId: string) {
    super('UsernameAlreadyInUseError');
    this.message = 'Selected username is already in use';
    this.name = 'UsernameAlreadyInUseError';
    this.code = '012';
    this.status = 400;
    this.userId = userId;
  }
}

export class ProfileAlreadyExistsError extends FullError {
  constructor(userId: string) {
    super('ProfileAlreadyExistsError');
    this.message = 'Profile already exists';
    this.name = 'ProfileAlreadyExistsError';
    this.code = '013';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectArgLengthError extends FullError {
  constructor(userId: string, target: string, min: number, max: number) {
    super('IncorrectArgLengthError');
    this.message =
      min === undefined
        ? `Elm ${target} should be less than ${max} characters`
        : `Elm ${target} should be more than ${min} and less than ${max} characters`;
    this.name = 'IncorrectArgLengthError';
    this.code = '014';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectTarget extends FullError {
  constructor(userId: string) {
    super('IncorrectTarget');
    this.message = 'Incorrect data target';
    this.code = '015';
    this.status = 400;
    this.userId = userId;
  }
}
