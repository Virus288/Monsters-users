import type UserController from '../../modules/user/controller';
import type UserRooster from '../../modules/user/rooster';
import type ProfileController from '../../modules/profile/controller';
import type ProfileRooster from '../../modules/profile/rooster';
import type { EModules } from './enums';
import type { IRegisterDto } from '../../modules/user/dto';
import type { IAddProfileDto } from '../../modules/profile/dto';
import type { IUserEntity } from '../../modules/user/entity';
import type { IProfileEntity } from '../../modules/profile/entity';

export interface IModulesHandlers {
  [EModules.Users]: UserController;
  [EModules.Profiles]: ProfileController;
}

export interface IModulesControllers {
  [EModules.Users]: UserRooster;
  [EModules.Profiles]: ProfileRooster;
}

export interface IRoosterAddData {
  [EModules.Users]: IRegisterDto;
  [EModules.Profiles]: IAddProfileDto;
}

export interface IRoosterAddDefaultData {
  [EModules.Users]: Partial<IRegisterDto>;
  [EModules.Profiles]: Partial<IAddProfileDto>;
}

export interface IRoosterGetData {
  [EModules.Users]: IUserEntity[];
  [EModules.Profiles]: IProfileEntity | null;
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
