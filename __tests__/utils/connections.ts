import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Log from '../../src/tools/logger/log';
import Redis from '../../src/tools/redis';
import State from '../../src/tools/state';

export default class Connection {
  async connect(): Promise<void> {
    await this.redis();
    await this.mongo();
  }

  async close(): Promise<void> {
    await State.Redis.close();
    await mongoose.disconnect();
    Log.log('Mongo', 'Mongo disconnected');
  }

  private async mongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    Log.log('Mongo', 'Mongo started');
  }

  private async redis(): Promise<void> {
    State.Redis = new Redis();
    await State.Redis.init();
  }
}
