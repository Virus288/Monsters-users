import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Log from '../../src/tools/logger/log';

export default class Connection {
  async connect(): Promise<void> {
    await this.mongo();
  }

  async close(): Promise<void> {
    await mongoose.disconnect();
    Log.log('Mongo', 'Mongo disconnected');
  }

  private async mongo(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    Log.log('Mongo', 'Mongo started');
  }
}
