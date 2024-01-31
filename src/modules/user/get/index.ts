import UserDetailsDto from './dto';
import ControllerFactory from '../../../tools/abstract/controller';
import Rooster from '../rooster';
import type { IUserDetailsDto } from './types';
import type { EModules } from '../../../tools/abstract/enums';
import type { IUserDetails, IUserEntity } from '../entity';

export default class Controller extends ControllerFactory<EModules.Users> {
  constructor() {
    super(new Rooster());
  }

  async get(data: IUserDetailsDto[]): Promise<IUserDetails[]> {
    const prepared = data.map((e) => new UserDetailsDto(e));

    const users = await Promise.all(
      prepared.map(async (u) => {
        return u.id ? this.rooster.get(u.id) : this.rooster.getByLogin(u.name as string);
      }),
    );

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
