import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import Rooster from '../../../src/modules/party/rooster';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IPartyEntity } from '../../../src/modules/party/entity';

describe('Party', () => {
  const db = new FakeFactory();
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
        const inv = await rooster.get(fakeParty._id);
        expect(inv).toEqual(null);
      });
    });
  });

  describe('Should pass', () => {
    it('Get party by id', async () => {
      await db.party.characters(fakeParty.characters)._id(fakeParty._id).leader(fakeParty.leader).create();

      const party = await rooster.get(fakeParty._id);

      expect(party?._id.toString()).toEqual(fakeParty._id);
      expect(party?.leader.toString()).toEqual(fakeParty.leader);
      expect(party?.characters.length).toEqual(fakeParty.characters.length);
    });

    it('Get party by leader', async () => {
      await db.party.characters(fakeParty.characters)._id(fakeParty._id).leader(fakeParty.leader).create();

      const party = await rooster.getByLeader(fakeParty.leader);

      expect(party?._id.toString()).toEqual(fakeParty._id);
      expect(party?.leader.toString()).toEqual(fakeParty.leader);
      expect(party?.characters.length).toEqual(fakeParty.characters.length);
    });
  });
});
