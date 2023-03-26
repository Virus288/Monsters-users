import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import getConfig from './configLoader';
import Log from './logger/log';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fakeData from '../../__tests__/utils/fakeData.json';
import FakeFactory from '../../__tests__/utils/fakeFactory/src';
import type { IRegisterDto } from '../modules/user/dto';
import type { IProfileEntity } from '../modules/profile/entity';

const mongo = async (): Promise<void> => {
  process.env.NODE_ENV === 'test' ? await startMockServer() : await startServer();
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

const startServer = async (): Promise<void> => {
  await mongoose.connect(getConfig().mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  Log.log('Mongo', 'Started server');
};

const startMockServer = async (): Promise<void> => {
  const server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());

  await fulfillDatabase();
  Log.log('Mongo', 'Started mock server');
};

const fulfillDatabase = async (): Promise<void> => {
  const users = fakeData.users as IRegisterDto[];
  const profiles = fakeData.profiles as IProfileEntity[];

  await Promise.all(
    users.map(async (u) => {
      const db = new FakeFactory();
      return await db.user.login(u.login).password(u.password).email(u.email).verified(false).create();
    }),
  );

  await Promise.all(
    profiles.map(async (p) => {
      const db = new FakeFactory();
      return await db.profile.user(p.user).race(p.race).create();
    }),
  );
};

export default mongo;
