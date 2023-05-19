import type UserController from '../../modules/user/controller';
import type ProfileController from '../../modules/profile/controller';
import type InventoryController from '../../modules/inventory/controller';
import type UserRooster from '../../modules/user/rooster';
import type ProfileRooster from '../../modules/profile/rooster';
import type InventoryRooster from '../../modules/inventory/rooster';
import type { EModules } from './enums';
import type { IRegisterDto } from '../../modules/user/dto';
import type { IAddProfileDto } from '../../modules/profile/dto';
import type { IAddItemDto } from '../../modules/inventory/dto';
import type { IUserEntity } from '../../modules/user/entity';
import type { IProfileEntity } from '../../modules/profile/entity';
import type { IInventoryEntity } from '../../modules/inventory/entity';

export interface IModulesHandlers {
  [EModules.Users]: UserController;
  [EModules.Profiles]: ProfileController;
  [EModules.Inventory]: InventoryController;
}

export interface IModulesControllers {
  [EModules.Users]: UserRooster;
  [EModules.Profiles]: ProfileRooster;
  [EModules.Inventory]: InventoryRooster;
}

export interface IRoosterAddData {
  [EModules.Users]: IRegisterDto;
  [EModules.Profiles]: IAddProfileDto;
  [EModules.Inventory]: IAddItemDto;
}

export interface IRoosterAddDefaultData {
  [EModules.Users]: Partial<IRegisterDto>;
  [EModules.Profiles]: Partial<IAddProfileDto>;
  [EModules.Inventory]: Partial<IInventoryEntity>;
}

export type IRoosterUpdate = IRoosterAddDefaultData;

export interface IRoosterGetData {
  [EModules.Users]: IUserEntity[];
  [EModules.Profiles]: IProfileEntity | null;
  [EModules.Inventory]: IInventoryEntity | null;
}

interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
