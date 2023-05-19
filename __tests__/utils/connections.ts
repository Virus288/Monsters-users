import Log from '../../src/tools/logger/log';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import State from '../../src/tools/state';
import Redis from '../../src/tools/redis';

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
    this.disconnect()
      .then(() => {
        setTimeout(() => {
          // Empty
        }, 2000);
      })
      .catch((err) => {
        Log.error('Mongoose', err);
      });
  }

  private async mongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  }

  private redis(): void {
    State.Redis = new Redis();
    State.Redis.startTestServer();
    State.Redis.init();
  }

  private async handleConnect(): Promise<void> {
    this.redis();
    await this.mongo();
  }

  private async disconnect(): Promise<void> {
    State.Redis.close();
    await mongoose.disconnect();
    await mongoose.connection.close();
  }
}
