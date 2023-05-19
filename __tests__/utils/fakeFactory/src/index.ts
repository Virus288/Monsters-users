import FakeUser from './user';
import FakeProfile from './profile';
import FakeInventory from './inventory';

export default class FakeFactory {
  private readonly _user: FakeUser;
  private readonly _profile: FakeProfile;
  private readonly _inventory: FakeInventory;

  constructor() {
    this._user = new FakeUser();
    this._profile = new FakeProfile();
    this._inventory = new FakeInventory();
  }

  get user(): FakeUser {
    return this._user;
  }

  get profile(): FakeProfile {
    return this._profile;
  }

  get inventory(): FakeInventory {
    return this._inventory;
  }

  async cleanUp(): Promise<void> {
    await this.user.cleanUp();
    await this.profile.cleanUp();
  }
}
