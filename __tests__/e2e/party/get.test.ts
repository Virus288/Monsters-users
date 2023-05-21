import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/party/controller';
import { Connection, fakeData, FakeFactory } from '../../utils';
import type { IGetPartyDto } from '../../../src/modules/party/dto';
import type { IPartyEntity } from '../../../src/modules/party/entity';

describe('Party - get', () => {
  const db = new FakeFactory();
  const fakeParty = fakeData.parties[0] as IPartyEntity;
  const get: IGetPartyDto = {
    id: fakeParty._id,
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
      it('Missing id', () => {
        const clone = structuredClone(get);
        clone.id = undefined!;

        controller.get(get).catch((err) => {
          expect(err).toEqual(new errors.MissingArgError('id'));
        });
      });
    });

    describe('Incorrect data', () => {
      it('Incorrect id', () => {
        const clone = structuredClone(get);
        clone.id = 'abc';

        controller.get(get).catch((err) => {
          expect(err).toEqual(new errors.IncorrectArgError('Provided party id is invalid'));
        });
      });

      it('Party does not exist', () => {
        controller.get(get).catch((err) => {
          expect(err).toEqual(new errors.PartyDoesNotExist());
        });
      });
    });
  });

  describe('Should pass', () => {
    it('Got party', async () => {
      await db.party._id(fakeParty._id).leader(fakeParty.leader).characters(fakeParty.characters).create();

      const party = await controller.get(get);

      expect(party._id.toString()).toEqual(fakeParty._id);
      expect(party.leader.toString()).toEqual(fakeParty.leader);
      expect(party.characters).toEqual(fakeParty.characters);
    });
  });
});
