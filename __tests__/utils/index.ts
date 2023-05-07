import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Log from '../../src/tools/logger/log';
import State from '../../src/tools/state';
import Redis from '../../src/tools/redis';

export const generateRandomName = (): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < 12; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};

export default class Connection {
  connect(): void {
    this.handleConnect()
      .then(() => {
        setTimeout(() => {
          // Empty
        }, 5000);
      })
      .catch((err) => {
        return Log.error('Mongo', err);
      });
  }

  close(): void {
    mongoose.connection
      .close()
      .then(() => {
        setTimeout(() => {
          // Empty
        }, 2000);
      })
      .catch((err) => {
        Log.error('Mongoose', err);
      });
  }

  private async handleMongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  }

  private async handleConnect(): Promise<void> {
    this.handleRedis();
    await this.handleMongo();
  }

  private handleRedis(): void {
    State.Redis = new Redis();
    State.Redis.init();
  }
}
