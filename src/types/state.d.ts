import type Broker from '../broker';

export interface IState {
  Broker: Broker;
}

export interface IConfigInterface {
  amqpURI: string;
  accessToken: string;
  refToken: string;
  mongoURI: string;
}
