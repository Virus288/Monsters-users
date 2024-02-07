import GetAllUsersDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IGetAllUsersDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IUserDetails, IUserEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async getAll(data: IGetAllUsersDto): Promise<IUserDetails[]> {
    const payload = new GetAllUsersDto(data);
    const users = await this.rooster.getAll(payload.page);

    return users
      .filter((u): u is IUserEntity => u !== null)
      .map((u) => {
        return {
          _id: u._id,
          login: u.login,
          verified: u.verified,
          type: u.type,
        };
      });
  }
}
