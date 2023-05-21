import Rooster from './rooster';
import Validator from './validation';
import { PartyAlreadyExists, PartyDoesNotExist } from '../../errors';
import ControllerFactory from '../../tools/abstract/controller';
import type { ICreatePartyDto, IGetPartyDto } from './dto';
import type { IPartyEntity } from './entity';
import type { EModules } from '../../tools/abstract/enums';

export default class Controller extends ControllerFactory<EModules.Party> {
  constructor() {
    super(new Rooster());
  }

  async get(payload: IGetPartyDto): Promise<IPartyEntity> {
    Validator.validateGet(payload);

    const { id } = payload;

    const eq = await this.rooster.get(id);
    if (!eq) throw new PartyDoesNotExist();

    return eq;
  }

  async create(payload: ICreatePartyDto, userId: string): Promise<void> {
    Validator.validateCreate(payload);

    const party = await this.rooster.getByLeader(userId);
    if (!party) throw new PartyAlreadyExists();

    await this.rooster.add(payload);
  }

  async addBasicParty(leader: string): Promise<IPartyEntity> {
    return this.rooster.addDefault({ leader });
  }
}
