import State from './tools/state';
import Log from './tools/logger/log';
import Broker from './broker';
import mongo from './tools/mongo';
import Redis from './tools/redis';

class App {
  init(): void {
    this.start()
      .then(() => {
        Log.log('Server', 'Server started');
      })
      .catch((err) => {
        Log.error('Server', 'Failed to init', JSON.stringify(err));
      });
  }

  private async start(): Promise<void> {
    await mongo();

    State.Broker = new Broker();
    State.Redis = new Redis();

    State.Broker.init();
    await State.Redis.init();
  }
}

const app = new App();
app.init();
