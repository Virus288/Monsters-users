import type * as enums from '../../enums';

export interface IAddProfileDto {
  race: enums.EUserRace;
}

export interface IGetProfileDto {
  id: string;
}
