import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import Rooster from '../../../src/modules/user/rooster';
import { FakeFactory, fakeData } from '../../utils';
import type { IRegisterDto } from '../../../src/modules/user/dto';

describe('Login', () => {
  const db = new FakeFactory();
  const loginData = fakeData.users[0] as IRegisterDto;

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    it('No data in database', async () => {
      const rooster = new Rooster();
      const user = await rooster.getByLogin(loginData.login);

      expect(user).toEqual(null);
    });

    it('Incorrect target', async () => {
      await db.user.login(loginData.login).password(loginData.password).email(loginData.email).verified(false).create();

      const rooster = new Rooster();
      const user = await rooster.getByLogin('a');

      expect(user).toEqual(null);
    });
  });

  describe('Should pass', () => {
    it('Validated', async () => {
      await db.user.login(loginData.login).password(loginData.password).email(loginData.email).verified(false).create();

      const rooster = new Rooster();
      const user = await rooster.getByEmail(loginData.email);
      const { login, password, email, verified, _id, type } = user[0]!;

      expect(login).toEqual(loginData.login);
      expect(password.length).not.toBeLessThan(loginData.password.length);
      expect(email).toEqual(loginData.email);
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
