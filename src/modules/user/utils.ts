import bcrypt from 'bcrypt';

// eslint-disable-next-line import/prefer-default-export
export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};
