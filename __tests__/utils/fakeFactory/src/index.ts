import FakeUser from './user';
import FakeProfile from './profile';

export default class FakeFactory {
  private readonly _user: FakeUser;
  private readonly _profile: FakeProfile;

  constructor() {
    this._user = new FakeUser();
    this._profile = new FakeProfile();
  }

  get user(): FakeUser {
    return this._user;
  }

  get profile(): FakeProfile {
    return this._profile;
  }

  async cleanUp(): Promise<void> {
    await this.user.cleanUp();
    await this.profile.cleanUp();
  }
}
