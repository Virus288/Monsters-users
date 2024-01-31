import type * as enums from '../../enums';

export interface IUserEntity {
  _id: string;
  login: string;
  email: string;
  verified: boolean;
  password: string;
  type: enums.EUserTypes;
}

export interface IUserDetails {
  _id: string;
  login: string;
  verified: boolean;
  type: enums.EUserTypes;
}
