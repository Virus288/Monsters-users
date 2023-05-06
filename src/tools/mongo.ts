import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import getConfig from './configLoader';
import Log from './logger/log';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fakeData from '../../__tests__/utils/fakeData.json';
import FakeFactory from '../../__tests__/utils/fakeFactory/src';
import type { IProfileEntity } from '../modules/profile/entity';
import type { IUserEntity } from '../modules/user/entity';

const fulfillDatabase = async (): Promise<void> => {
  const users = fakeData.users as IUserEntity[];
  const profiles = fakeData.profiles as IProfileEntity[];

  await Promise.all(
    users.map(async (u) => {
      const db = new FakeFactory();
      return db.user
        ._id(u._id ?? undefined)
        .login(u.login)
        .password(u.password)
        .email(u.email)
        .verified(u.verified)
        .type(u.type)
        .create();
    }),
  );

  await Promise.all(
    profiles.map(async (p) => {
      const db = new FakeFactory();
      return db.profile.user(p.user).race(p.race).create();
    }),
  );
};

const startMockServer = async (): Promise<void> => {
  const server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());

  await fulfillDatabase();
  Log.log('Mongo', 'Started mock server');
};

const startServer = async (): Promise<void> => {
  await mongoose.connect(getConfig().mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Users',
  } as ConnectOptions);
  Log.log('Mongo', 'Started server');
};

const mongo = async (): Promise<void> => {
  process.env.NODE_ENV === 'test' ? await startMockServer() : await startServer();
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

export default mongo;
