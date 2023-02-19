import type * as types from './';
import * as enums from '../enums';

export interface IRabbitMessage {
  user: types.ILocalUser;
  target: enums.EMessageTargets | enums.EMessageTypes;
  subTarget: enums.EUserTargets | enums.EProfileTargets;
  payload: unknown;
}
