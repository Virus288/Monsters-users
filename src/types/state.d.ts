import type Broker from '../broker';
import type Mongo from '../tools/mongo';

export interface IState {
  broker: Broker;
  mongo: Mongo;
}

export interface IConfigInterface {
  amqpURI: string;
  accessToken: string;
  refToken: string;
  mongoURI: string;
}
