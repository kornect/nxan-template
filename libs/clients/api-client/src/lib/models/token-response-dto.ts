/* tslint:disable */
/* eslint-disable */
export interface TokenResponseDto {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  tokenType: string;
  user: {
[key: string]: string;
};
}
