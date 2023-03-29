import type { EFakeData } from '../enums';
import type User from '../../../../src/modules/user/model';
import type Profile from '../../../../src/modules/profile/model';
import type { IProfileEntity } from '../../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../../src/modules/user/entity';

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeState {
  [EFakeData.User]: IFakeParam<IUserEntity>;
  [EFakeData.Profile]: IFakeParam<IProfileEntity>;
}

export interface IFakeModel {
  [EFakeData.User]: typeof User;
  [EFakeData.Profile]: typeof Profile;
}

export type IAbstractBody<T> = {
  [P in keyof T]: ([arg]?: typeof P) => this;
};
