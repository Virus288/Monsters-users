import jwt from 'jsonwebtoken';
import * as enums from '../enums';
import getConfig from './configLoader';
import bcrypt from 'bcrypt';

export const generateAccessToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().accessToken, {
    expiresIn: enums.EJwtTime.TokenMaxAge,
  });
};

export const generateRefreshToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().refToken, {
    expiresIn: enums.EJwtTime.RefreshTokenMaxAge,
  });
};

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};
