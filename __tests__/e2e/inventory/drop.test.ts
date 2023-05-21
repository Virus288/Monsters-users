import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/inventory/controller';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IDropItemDto } from '../../../src/modules/inventory/dto';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IItemEntity } from '../../../src/modules/items/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Items - drop', () => {
  const db = new FakeFactory();
  const fakeUser = fakeData.users[0] as IUserEntity;
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const fakeItem = fakeData.items[0] as IItemEntity;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const drop: IDropItemDto = {
    itemId: fakeItem._id,
    amount: 2,
  };
  const controller = new Controller();
  const connection = new Connection();

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
    connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    connection.close();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it('Missing itemId', () => {
        const clone = structuredClone(drop);
        clone.itemId = undefined!;
        controller.drop(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        });
      });

      it('Missing itemId', () => {
        const clone = structuredClone(drop);
        clone.itemId = undefined!;
        controller.drop(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('ItemId not proper id', () => {
        const clone = structuredClone(drop);
        clone.itemId = 'a';
        controller.drop(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Provided itemId is invalid'));
        });
      });

      it('Incorrect amount', () => {
        const clone = structuredClone(drop);
        clone.amount = 0!;
        controller.drop(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgAmountError('amount', 0, 100));
        });
      });

      it('No enough items in inventory', async () => {
        await db.profile
          .user(fakeProfile.user)
          .race(fakeProfile.race)
          .lvl(fakeProfile.lvl)
          .exp(fakeProfile.exp)
          .friends(fakeProfile.friends)
          .inventory(fakeInv._id)
          .party(fakeParty._id)
          .create();

        await db.inventory
          ._id(fakeInv._id)
          .items([
            {
              itemId: fakeItem._id,
              quantity: 1,
            },
          ])
          .userId(fakeProfile.user)
          .create();

        try {
          await controller.drop(drop, fakeProfile.user);
        } catch (err) {
          expect(err).toEqual(new errors.InsufficientAmount());
        }
        await db.cleanUp();
      });
    });
  });

  describe('Should pass', () => {
    it('Dropped item', async () => {
      await db.profile
        .user(fakeProfile.user)
        .race(fakeProfile.race)
        .lvl(fakeProfile.lvl)
        .exp(fakeProfile.exp)
        .friends(fakeProfile.friends)
        .inventory(fakeInv._id)
        .party(fakeParty._id)
        .create();

      await db.inventory
        ._id(fakeInv._id)
        .items([
          {
            itemId: fakeItem._id,
            quantity: 3,
          },
        ])
        .userId(fakeProfile.user)
        .create();

      const func = async (): Promise<void> => controller.drop(drop, fakeProfile.user);
      expect(func).not.toThrow();
    });
  });
});
