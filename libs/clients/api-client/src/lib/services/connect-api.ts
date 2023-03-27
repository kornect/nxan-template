/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { TokenRequestDto } from '../models/token-request-dto';
import { TokenResponseDto } from '../models/token-response-dto';
import { UserInfoDto } from '../models/user-info-dto';

@Injectable({
  providedIn: 'root',
})
export class ConnectApi extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getToken
   */
  static readonly GetTokenPath = '/auth/connect/token';

  /**
   * Get an access token.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getToken()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getToken$Response(params: {
    body: TokenRequestDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<TokenResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ConnectApi.GetTokenPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<TokenResponseDto>;
      })
    );
  }

  /**
   * Get an access token.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getToken$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getToken(params: {
    body: TokenRequestDto
  },
  context?: HttpContext

): Observable<TokenResponseDto> {

    return this.getToken$Response(params,context).pipe(
      map((r: StrictHttpResponse<TokenResponseDto>) => r.body as TokenResponseDto)
    );
  }

  /**
   * Path part for operation getUserinfo
   */
  static readonly GetUserinfoPath = '/auth/connect/userinfo';

  /**
   * Get user info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserinfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserinfo$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<UserInfoDto>> {

    const rb = new RequestBuilder(this.rootUrl, ConnectApi.GetUserinfoPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserInfoDto>;
      })
    );
  }

  /**
   * Get user info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getUserinfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserinfo(params?: {
  },
  context?: HttpContext

): Observable<UserInfoDto> {

    return this.getUserinfo$Response(params,context).pipe(
      map((r: StrictHttpResponse<UserInfoDto>) => r.body as UserInfoDto)
    );
  }

}
