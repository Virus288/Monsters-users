import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/inventory/use';
import * as utils from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IUseItemDto } from '../../../src/modules/inventory/use/types';
import type { IItemEntity } from '../../../src/modules/items/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';
import type { IUserEntity } from '../../../src/modules/user/entity';

describe('Items - use', () => {
  const db = new utils.FakeFactory();
  const fakeUser = utils.fakeData.users[0] as IUserEntity;
  const fakeProfile = utils.fakeData.profiles[0] as IProfileEntity;
  const fakeItem = utils.fakeData.items[0] as IItemEntity;
  const fakeInv = utils.fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = utils.fakeData.parties[0] as IPartyEntity;
  const use: IUseItemDto = {
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
        const clone = structuredClone(use);
        clone.itemId = undefined!;
        controller.use(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        });
      });

      it('Missing itemId', () => {
        const clone = structuredClone(use);
        clone.itemId = undefined!;
        controller.use(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('itemId'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('ItemId not proper id', () => {
        const clone = structuredClone(use);
        clone.itemId = 'a';
        controller.use(clone, fakeUser._id).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgTypeError('itemId should be objectId'));
        });
      });

      it('Incorrect amount', () => {
        const clone = structuredClone(use);
        clone.amount = 0!;
        controller.use(clone, fakeUser._id).catch((err) => {
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
          await controller.use(use, fakeProfile.user);
        } catch (err) {
          expect(err).toEqual(new errors.InsufficientAmount());
        }
        await db.cleanUp();
      });
    });
  });

  describe('Should pass', () => {
    it('Used item', async () => {
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

      const func = async (): Promise<void> => controller.use(use, fakeProfile.user);
      expect(func).not.toThrow();
    });
  });
});
