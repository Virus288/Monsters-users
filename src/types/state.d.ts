import type Broker from '../broker';
import type Redis from '../tools/redis';

export interface IState {
  Broker: Broker;
  Redis: Redis;
}

export interface IConfigInterface {
  amqpURI: string;
  redisURI: string;
  accessToken: string;
  refToken: string;
  mongoURI: string;
}
