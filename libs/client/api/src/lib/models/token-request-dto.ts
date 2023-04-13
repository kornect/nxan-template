/* tslint:disable */
/* eslint-disable */
export interface TokenRequestDto {
  grant_type: 'password' | 'refresh_token';
  password: string;
  refresh_token: string;
  scopes: string;
  username: string;
}
