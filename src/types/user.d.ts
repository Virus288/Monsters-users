import type * as enums from '../enums';

export interface ILocalUser {
  userId: string | undefined;
  tempId: string;
  validated: boolean;
  type: enums.EUserTypes;
}

export interface IUserCredentials {
  id: string;
}
