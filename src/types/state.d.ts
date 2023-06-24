import type Broker from '../broker';
import type Mongo from '../tools/mongo';
import type Redis from '../tools/redis';

export interface IState {
  broker: Broker;
  redis: Redis;
  mongo: Mongo;
}

export interface IConfigInterface {
  amqpURI: string;
  redisURI: string;
  accessToken: string;
  refToken: string;
  mongoURI: string;
}
