import Broker from './connections/broker';
import Mongo from './connections/mongo';
import Redis from './connections/redis';
import Log from './tools/logger/log';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  init(): void {
    this.start().catch((err) => {
      const { stack, message } = err as IFullError;
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', message, stack);

      return this.kill();
    });
  }

  async kill(): Promise<void> {
    State.broker.close();
    await State.redis.close();

    Log.log('Server', 'Server closed');
  }

  private async start(): Promise<void> {
    const mongo = new Mongo();
    await mongo.init();

    State.broker = new Broker();
    State.redis = new Redis();

    State.broker.init();
    await State.redis.init();
    Log.log('Server', 'Server started');
  }
}

const app = new App();
app.init();
