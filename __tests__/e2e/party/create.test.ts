import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/party/add';
import { fakeData, FakeFactory } from '../../utils';
import type { IAddPartyDto } from '../../../src/modules/party/add/types';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Party - create', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const create: IAddPartyDto = {
    leader: fakeUser._id,
    characters: [],
  };
  const controller = new Controller();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it('Missing leader', () => {
        const clone = structuredClone(create);
        clone.leader = undefined!;

        controller.add(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('leader'));
        });
      });

      it('Missing characters', () => {
        const clone = structuredClone(create);
        clone.characters = undefined!;

        controller.add(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('characters'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect leader', () => {
        const clone = structuredClone(create);
        clone.leader = 'a';

        controller.add(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('leader should be objectId'));
        });
      });

      it('Incorrect characters', () => {
        const clone = structuredClone(create);
        clone.characters = 'a' as unknown as string[];

        controller.add(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('characters should be array'));
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Create party', () => {
      const clone = structuredClone(create);
      clone.leader = undefined!;

      const func = async (): Promise<void> => controller.add(create, fakeUser._id);
      expect(func).not.toThrow();
    });
  });
});
