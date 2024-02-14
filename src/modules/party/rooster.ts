import Party from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { IPartyEntity } from './entity';
import type { IParty } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<IParty, typeof Party, EModules.Party> {
  constructor() {
    super(Party);
  }

  async getByLeader(id: string): Promise<IPartyEntity | null> {
    return Party.findOne({ leader: id }).lean();
  }

  async remove(leader: string): Promise<void> {
    await Party.findOneAndDelete({ leader });
  }
}
