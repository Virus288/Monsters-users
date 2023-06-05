// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
}

export class MissingProcessPlatformError extends FullError {
  constructor() {
    super('MissingProcessPlatformError');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatformError';
    this.code = '001';
    this.status = 500;
  }
}

export class MissingArgError extends FullError {
  constructor(param: string) {
    super('MissingArgError');
    this.message = `Missing param: ${param}`;
    this.name = 'MissingArgError';
    this.code = '002';
    this.status = 400;
  }
}

export class IncorrectArgError extends FullError {
  constructor(err: string) {
    super('IncorrectArgError');
    this.message = err;
    this.name = 'IncorrectArgError';
    this.code = '003';
    this.status = 400;
  }
}

export class IncorrectArgTypeError extends FullError {
  constructor(err: string) {
    super('IncorrectArgTypeError');
    this.message = err;
    this.name = 'IncorrectArgTypeError';
    this.code = '004';
    this.status = 400;
  }
}

export class IncorrectCredentialsError extends FullError {
  constructor(message?: string) {
    super('IncorrectCredentialsError');
    this.message = message ?? 'Incorrect credentials';
    this.name = 'IncorrectCredentialsError';
    this.code = '005';
    this.status = 400;
  }
}

export class UserAlreadyRegisteredError extends FullError {
  constructor() {
    super('UserAlreadyRegisteredError');
    this.message = 'Email already registered';
    this.name = 'UserAlreadyRegisteredError';
    this.code = '006';
    this.status = 400;
  }
}

export class UsernameAlreadyInUseError extends FullError {
  constructor() {
    super('UsernameAlreadyInUseError');
    this.message = 'Selected username is already in use';
    this.name = 'UsernameAlreadyInUseError';
    this.code = '007';
    this.status = 400;
  }
}

export class ProfileAlreadyInitializedError extends FullError {
  constructor() {
    super('ProfileAlreadyInitializedError');
    this.message = 'Profile already initialized';
    this.name = 'ProfileAlreadyInitializedError';
    this.code = '008';
    this.status = 400;
  }
}

export class IncorrectArgLengthError extends FullError {
  constructor(target: string, min: number | undefined, max: number) {
    super('IncorrectArgLengthError');
    this.message =
      min === undefined
        ? `${target} should be less than ${max} characters`
        : min !== max
        ? `${target} should be more than ${min} and less than ${max} characters`
        : `${target} should be ${min} characters`;
    this.name = 'IncorrectArgLengthError';
    this.code = '009';
    this.status = 400;
  }
}

export class IncorrectTargetError extends FullError {
  constructor() {
    super('IncorrectTargetError');
    this.message = 'Incorrect data target';
    this.name = 'IncorrectTargetError';
    this.code = '010';
    this.status = 400;
  }
}

export class NotConnectedError extends FullError {
  constructor() {
    super('NotConnectedError');
    this.message = 'Rabbit is not connected';
    this.name = 'NotConnectedError';
    this.code = '011';
    this.status = 500;
  }
}

export class UserDoesNotExist extends FullError {
  constructor() {
    super('UserDoesNotExist');
    this.message = 'Selected user does not exist';
    this.name = 'UserDoesNotExist';
    this.code = '012';
    this.status = 400;
  }
}

export class NoPermission extends FullError {
  constructor() {
    super('NoPermission');
    this.message = 'You have no permission to make that action';
    this.name = 'NoPermission';
    this.code = '013';
    this.status = 400;
  }
}

export class IncorrectArgAmountError extends FullError {
  constructor(target: string, min: number | undefined, max: number) {
    super('IncorrectArgAmountError');
    this.message =
      min === undefined
        ? `${target} should be less than ${max}`
        : min !== max
        ? `${target} should be more than ${min} and less than ${max}`
        : `${target} should be ${min}`;
    this.name = 'IncorrectArgAmountError';
    this.code = '014';
    this.status = 400;
  }
}

export class InventoryDoesNotExist extends FullError {
  constructor() {
    super('InventoryDoesNotExist');
    this.message = 'Selected inventory does not exist';
    this.name = 'InventoryDoesNotExist';
    this.code = '015';
    this.status = 400;
  }
}

export class ItemNotInInventory extends FullError {
  constructor() {
    super('ItemNotInInventory');
    this.message = 'Selected item does not exist in your inventory';
    this.name = 'ItemNotInInventory';
    this.code = '016';
    this.status = 400;
  }
}

export class InsufficientAmount extends FullError {
  constructor() {
    super('InsufficientAmount');
    this.message = 'Insufficient amount of items in inventory';
    this.name = 'InsufficientAmount';
    this.code = '017';
    this.status = 400;
  }
}

export class PartyAlreadyExists extends FullError {
  constructor() {
    super('PartyAlreadyExists');
    this.message = 'Party already exists';
    this.name = 'PartyAlreadyExists';
    this.code = '018';
    this.status = 400;
  }
}

export class ProfileDoesNotExists extends FullError {
  constructor() {
    super('ProfileDoesNotExists');
    this.message = 'Profile does not exist';
    this.name = 'ProfileDoesNotExists';
    this.code = '019';
    this.status = 400;
  }
}

export class PartyDoesNotExist extends FullError {
  constructor() {
    super('PartyDoesNotExist');
    this.message = 'Party does not exist';
    this.name = 'PartyDoesNotExist';
    this.code = '020';
    this.status = 400;
  }
}

export class ElementTooShortError extends FullError {
  constructor(target: string, min: number) {
    super('ElementTooShortError');
    this.message = `Element ${target} is too short. Minimum length is ${min}`;
    this.name = 'ElementTooShortError';
    this.code = '021';
    this.status = 400;
  }
}

export class ElementTooLongError extends FullError {
  constructor(target: string, min: number) {
    super('ElementTooShortError');
    this.message = `Element ${target} is too long. Maximum length is ${min}`;
    this.name = 'ElementTooShortError';
    this.code = '022';
    this.status = 400;
  }
}
