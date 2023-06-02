import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import Rooster from '../../../src/modules/inventory/rooster';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IInventoryEntity } from '../../../src/modules/inventory/entity';
import type { IItemEntity } from '../../../src/modules/items/entity';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IProfileEntity } from '../../../src/modules/profile/entity';

describe('Inventory', () => {
  const db = new FakeFactory();
  const fakeProfile = fakeData.profiles[0] as IProfileEntity;
  const fakeItem = fakeData.items[0] as IItemEntity;
  const fakeInv = fakeData.inventories[0] as IInventoryEntity;
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const rooster = new Rooster();
  const connection = new Connection();

  beforeAll(async () => {
    await connection.connect();
  });

  afterEach(async () => {
    await db.cleanUp();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it('Missing data in db', async () => {
        const inv = await rooster.get(fakeInv._id);
        expect(inv).toEqual(null);
      });
    });
  });

  describe('Should pass', () => {
    it('Get inventory by id', async () => {
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

      const inv = await rooster.get(fakeInv._id);
      expect(inv?._id.toString()).toEqual(fakeInv._id.toString());
      expect(inv?.items.length).toEqual(1);
      expect(inv?.userId.toString()).toEqual(fakeInv.userId.toString());
    });

    it('Get inventory by user', async () => {
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

      const inv = await rooster.getByUser(fakeInv.userId);
      expect(inv?._id.toString()).toEqual(fakeInv._id.toString());
      expect(inv?.items.length).toEqual(1);
      expect(inv?.userId.toString()).toEqual(fakeInv.userId.toString());
    });

    it('Remove inventory', async () => {
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

      await rooster.remove(fakeInv._id);
      const inv = await rooster.get(fakeInv._id);

      expect(inv).toEqual(null);
    });

    it('Update inventory', async () => {
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

      await rooster.update(fakeProfile.user, { items: [] });
      const inv = await rooster.get(fakeInv._id);

      expect(inv?.items.length).toEqual(0);
    });
  });
});
