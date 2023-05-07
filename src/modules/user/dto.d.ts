export interface ILoginDto {
  login: string;
  password: string;
}

export interface IRegisterDto extends ILoginDto {
  email: string;
}

export interface IUserDetailsDto {
  name?: string;
  id?: string;
}

export interface IRemoveUserDto {
  name: string;
}
