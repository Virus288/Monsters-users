import type * as enums from '../../enums';

IAddUserDto;

export interface IAddProfileDto {
  race: enums.EUserRace;
  user: string;
}

export interface IGetProfileDto {
  id: string;
}
