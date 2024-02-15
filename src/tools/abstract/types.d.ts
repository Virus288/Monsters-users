import type { EModules } from './enums';
import type { IAddItemDto } from '../../modules/inventory/addBasic/types';
import type { IInventoryEntity } from '../../modules/inventory/entity';
import type InventoryGet from '../../modules/inventory/get';
import type InventoryRooster from '../../modules/inventory/rooster';
import type { IAddLogDto } from '../../modules/logs/add/types';
import type { ILogEntity } from '../../modules/logs/entity';
import type LogGet from '../../modules/logs/get';
import type LogsRooster from '../../modules/logs/rooster';
import type { IAddPartyDto } from '../../modules/party/add/types';
import type { IPartyEntity } from '../../modules/party/entity';
import type PartyGet from '../../modules/party/get';
import type PartyRooster from '../../modules/party/rooster';
import type { IAddProfileDto } from '../../modules/profile/add/types';
import type { IProfileEntity } from '../../modules/profile/entity';
import type ProfileGet from '../../modules/profile/get';
import type ProfileRooster from '../../modules/profile/rooster';
import type { IUserEntity } from '../../modules/user/entity';
import type UserGet from '../../modules/user/get';
import type { IRegisterDto } from '../../modules/user/register/types';
import type UserRooster from '../../modules/user/rooster';

export interface IModulesGetControllers {
  [EModules.Users]: UserGet;
  [EModules.Party]: PartyGet;
  [EModules.Profiles]: ProfileGet;
  [EModules.Inventory]: InventoryGet;
  [EModules.Logs]: LogGet;
}

export interface IModulesControllers {
  [EModules.Users]: UserRooster;
  [EModules.Profiles]: ProfileRooster;
  [EModules.Inventory]: InventoryRooster;
  [EModules.Party]: PartyRooster;
  [EModules.Logs]: LogsRooster;
}

export interface IRoosterAddData {
  [EModules.Users]: IRegisterDto;
  [EModules.Profiles]: IAddProfileDto;
  [EModules.Inventory]: IAddItemDto;
  [EModules.Party]: IAddPartyDto;
  [EModules.Logs]: IAddLogDto;
}

export interface IRoosterAddDefaultData {
  [EModules.Users]: Partial<IUserEntity>;
  [EModules.Profiles]: Partial<IProfileEntity>;
  [EModules.Inventory]: Partial<IInventoryEntity>;
  [EModules.Party]: Partial<IPartyEntity>;
  [EModules.Logs]: Partial<ILogEntity>;
}

export interface IRoosterDefaultDataCallback {
  [EModules.Users]: IUserEntity;
  [EModules.Profiles]: IProfileEntity;
  [EModules.Inventory]: IInventoryEntity;
  [EModules.Party]: IPartyEntity;
  [EModules.Logs]: ILogEntity;
}

export interface IRoosterUpdate extends IRoosterAddDefaultData {
  [EModules.Logs]: Partial<ILogEntity>;
}

export interface IRoosterGetData {
  [EModules.Users]: IUserEntity | null;
  [EModules.Profiles]: IProfileEntity | null;
  [EModules.Inventory]: IInventoryEntity | null;
  [EModules.Party]: IPartyEntity | null;
  [EModules.Logs]: ILogEntity | null;
}

export interface IRoosterFactory<Z extends EModules> {
  add(data: IRoosterAddData[Z]): Promise<string>;

  get(data: unknown): Promise<IRoosterGetData[Z]>;
}
