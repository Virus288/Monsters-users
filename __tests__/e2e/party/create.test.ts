import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/party/controller';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { ICreatePartyDto } from '../../../src/modules/party/dto';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Party - create', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const create: ICreatePartyDto = {
    leader: fakeUser._id,
    characters: [],
  };
  const controller = new Controller();
  const connection = new Connection();

  beforeAll(() => {
    connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(() => {
    connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing leader', () => {
        const clone = structuredClone(create);
        clone.leader = undefined!;

        controller.create(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('leader'));
        });
      });

      it('Missing characters', () => {
        const clone = structuredClone(create);
        clone.characters = undefined!;

        controller.create(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('characters'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect leader', () => {
        const clone = structuredClone(create);
        clone.leader = 'a';

        controller.create(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Provided Leader id is invalid'));
        });
      });

      it('Incorrect characters', () => {
        const clone = structuredClone(create);
        clone.characters = 'a' as unknown as string[];

        controller.create(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Provided characters list is invalid'));
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Create party', () => {
      const clone = structuredClone(create);
      clone.leader = undefined!;

      const func = async (): Promise<void> => controller.create(create, fakeUser._id);
      expect(func).not.toThrow();
    });
  });
});
