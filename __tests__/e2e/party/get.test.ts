import { afterEach, describe, expect, it } from '@jest/globals';
import * as errors from '../../../src/errors';
import Controller from '../../../src/modules/party/get';
import * as utils from '../../utils';
import type { IPartyEntity } from '../../../src/modules/party/entity';
import type { IGetPartyDto } from '../../../src/modules/party/get/types';

describe('Party - get', () => {
  const db = new utils.FakeFactory();
  const fakeParty = utils.fakeData.parties[0] as IPartyEntity;
  const get: IGetPartyDto = {
    id: fakeParty._id,
  };
  const controller = new Controller();

  afterEach(async () => {
    await db.cleanUp();
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
