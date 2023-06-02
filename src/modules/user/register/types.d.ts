import type { ILoginDto } from '../login/types';

export interface IRegisterDto extends ILoginDto {
  email: string;
}
