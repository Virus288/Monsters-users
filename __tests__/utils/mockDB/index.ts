import FakeUser from './user';
import FakeProfile from './profile';

export default class Database {
  user: FakeUser;
  profile: FakeProfile;

  constructor() {
    this.user = new FakeUser();
    this.profile = new FakeProfile();
  }

  async cleanUp(): Promise<void> {
    await this.user.cleanUp();
    await this.profile.cleanUp();
  }
}
