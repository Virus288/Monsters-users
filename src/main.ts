import Broker from './broker';
import Log from './tools/logger/log';
import Mongo from './tools/mongo';
import Redis from './tools/redis';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  init(): void {
    this.start()
      .then(() => {
        Log.log('Server', 'Server started');
      })
      .catch((err) => {
        const error = err as IFullError;
        return Log.error('Server', 'Failed to init', error.message, error.stack);
      });
  }

  private async start(): Promise<void> {
    const mongo = new Mongo();
    await mongo.init();

    State.Broker = new Broker();
    State.Redis = new Redis();

    State.Broker.init();
    await State.Redis.init();
  }
}

const app = new App();
app.init();
