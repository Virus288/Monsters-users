import type { EModules } from './enums';
import type InventoryController from '../../modules/inventory/controller';
import type { IAddItemDto } from '../../modules/inventory/dto';
import type { IInventoryEntity } from '../../modules/inventory/entity';
import type InventoryRooster from '../../modules/inventory/rooster';
import type IPartyController from '../../modules/party/controller';
import type { ICreatePartyDto } from '../../modules/party/dto';
import type { IPartyEntity } from '../../modules/party/entity';
import type IPartyRooster from '../../modules/party/rooster';
import type ProfileController from '../../modules/profile/controller';
import type { IAddProfileDto } from '../../modules/profile/dto';
import type { IProfileEntity } from '../../modules/profile/entity';
import type ProfileRooster from '../../modules/profile/rooster';
import type UserController from '../../modules/user/controller';
import type { IRegisterDto } from '../../modules/user/dto';
import type { IUserEntity } from '../../modules/user/entity';
import type UserRooster from '../../modules/user/rooster';

export interface IModulesHandlers {
  [EModules.Users]: UserController;
  [EModules.Profiles]: ProfileController;
  [EModules.Inventory]: InventoryController;
  [EModules.Party]: IPartyController;
}

export interface IModulesControllers {
  [EModules.Users]: UserRooster;
  [EModules.Profiles]: ProfileRooster;
  [EModules.Inventory]: InventoryRooster;
  [EModules.Party]: IPartyRooster;
}

export interface IRoosterAddData {
  [EModules.Users]: IRegisterDto;
  [EModules.Profiles]: IAddProfileDto;
  [EModules.Inventory]: IAddItemDto;
  [EModules.Party]: ICreatePartyDto;
}

export interface IRoosterAddDefaultData {
  [EModules.Users]: Partial<IUserEntity>;
  [EModules.Profiles]: Partial<IProfileEntity>;
  [EModules.Inventory]: Partial<IInventoryEntity>;
  [EModules.Party]: Partial<IPartyEntity>;
}

export interface IRoosterDefaultDataCallback {
  [EModules.Users]: IUserEntity;
  [EModules.Profiles]: IProfileEntity;
  [EModules.Inventory]: IInventoryEntity;
  [EModules.Party]: IPartyEntity;
}

export type IRoosterUpdate = IRoosterAddDefaultData;

export interface IRoosterGetData {
  [EModules.Users]: IUserEntity[];
  [EModules.Profiles]: IProfileEntity | null;
  [EModules.Inventory]: IInventoryEntity | null;
  [EModules.Party]: IPartyEntity | null;
}

export interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
