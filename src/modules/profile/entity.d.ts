import type * as enums from '../../enums';

export interface IProfileEntity {
  _id: string;
  user: string;
  race: enums.EUserRace;
  friends: string[];
  lvl: number;
  exp: [number, number];
}
