export interface ILoginDto {
  login: string;
  password: string;
}

export interface IRegisterDto extends ILoginDto {
  email: string;
}
