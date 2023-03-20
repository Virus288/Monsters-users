import { EFakeData } from '../enums';
import { IProfileLean, IUserLean } from '../../../../src/types';
import User from '../../../../src/modules/user/model';
import Profile from '../../../../src/modules/profile/model';

export interface IFakeState {
  [EFakeData.User]: IUserLean;
  [EFakeData.Profile]: IProfileLean;
}

export interface IFakeBody {
  [EFakeData.User]: IFakeParam<IUserLean>;
  [EFakeData.Profile]: IFakeParam<IProfileLean>;
}

export type IFakeParam<T> = {
  [P in keyof T]?: T[P];
};

export interface IFakeModel {
  [EFakeData.User]: typeof User;
  [EFakeData.Profile]: typeof Profile;
}
