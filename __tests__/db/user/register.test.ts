import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as enums from '../../../src/enums';
import Rooster from '../../../src/modules/user/rooster';
import { fakeData, FakeFactory } from '../../utils';
import type { IRegisterDto } from '../../../src/modules/user/dto';

describe('Register', () => {
  const db = new FakeFactory();
  const registerData = fakeData.users[0] as IRegisterDto;

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
      const user = await rooster.getByEmail(registerData.email);

      expect(user).toEqual(null);
    });

    it('Incorrect target', async () => {
      await db.user
        .login(registerData.login)
        .password(registerData.password)
        .email(registerData.email)
        .verified(false)
        .create();

      const rooster = new Rooster();
      const user = await rooster.getByLogin('a');

      expect(user).toEqual(null);
    });
  });

  describe('Should pass', () => {
    it('Validated', async () => {
      const rooster = new Rooster();
      await rooster.add(registerData);
      const user = await rooster.getByLogin(registerData.login);
      const { login, password, email, verified, _id, type } = user!;

      expect(login).toEqual(registerData.login);
      expect(password.length).not.toBeLessThan(registerData.password.length);
      expect(email).toEqual(registerData.email);
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
