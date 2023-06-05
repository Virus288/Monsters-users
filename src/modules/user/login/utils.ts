import bcrypt from 'bcrypt';
import * as errors from '../../../errors';

export default class Utils {
  async compare(password: string, hashed: string): Promise<void> {
    const auth = await bcrypt.compare(password, hashed);
    if (!auth) throw new errors.IncorrectCredentialsError();
  }
}
