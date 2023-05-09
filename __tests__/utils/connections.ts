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

  private async mongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  }

  private async redis(): Promise<void> {
    State.Redis = new Redis();
    State.Redis.startTestServer();
    await State.Redis.init();
  }

  private async handleConnect(): Promise<void> {
    await this.redis();
    await this.mongo();
  }
}
