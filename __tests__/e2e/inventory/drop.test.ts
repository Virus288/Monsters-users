import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/inventory/drop';
import * as utils from '../../utils';
import type { IDropItemDto } from '../../../src/modules/inventory/drop/types';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IItemEntity } from '../../../src/modules/items/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Items - drop', () => {
  const db = new utils.FakeFactory();
  const fakeUser = utils.fakeData.users[0] as IUserEntity;
  const fakeProfile = utils.fakeData.profiles[0] as IProfileEntity;
  const fakeItem = utils.fakeData.items[0] as IItemEntity;
  const fakeInv = utils.fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = utils.fakeData.parties[0] as IPartyEntity;
  const drop: IDropItemDto = {
    itemId: fakeItem._id,
    amount: 2,
  };
  const controller = new Controller();

  afterEach(async () => {
    await db.cleanUp();
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
          expect(err).toEqual(new errors.IncorrectArgTypeError('itemId should be objectId'));
        });
      });

      it('Incorrect amount', () => {
        const clone = structuredClone(drop);
        clone.amount = 0!;
        controller.drop(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgLengthError('amount', 1, 100));
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
