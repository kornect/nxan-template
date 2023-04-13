/* tslint:disable */

/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { BaseService } from '../base-service';
import { ChangeDisplayName } from '../models/change-display-name';
import { ChangeEmailDto } from '../models/change-email-dto';
import { ChangePasswordDto } from '../models/change-password-dto';
import { ConfirmEmailChangeDto } from '../models/confirm-email-change-dto';
import { DeleteAccountDto } from '../models/delete-account-dto';
import { ForgotPasswordDto } from '../models/forgot-password-dto';
import { RegisterCancelDto } from '../models/register-cancel-dto';
import { RegisterConfirmDto } from '../models/register-confirm-dto';
import { RegisterResendConfirmDto } from '../models/register-resend-confirm-dto';
import { RegisterUserDto } from '../models/register-user-dto';
import { ResetPasswordDto } from '../models/reset-password-dto';
import { ResponseResult } from '../models/response-result';
import { RequestBuilder } from '../request-builder';
import { StrictHttpResponse } from '../strict-http-response';

@Injectable({
  providedIn: 'root',
})
export class UsersApi extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation register
   */
  static readonly RegisterPath = '/users/register';

  /**
   * Register a new user.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `register()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register$Response(
    params: {
      body: RegisterUserDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.RegisterPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Register a new user.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `register$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register(
    params: {
      body: RegisterUserDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.register$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation registerConfirm
   */
  static readonly RegisterConfirmPath = '/users/register-confirm';

  /**
   * Confirm a new user.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerConfirm()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerConfirm$Response(
    params: {
      body: RegisterConfirmDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.RegisterConfirmPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Confirm a new user.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registerConfirm$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerConfirm(
    params: {
      body: RegisterConfirmDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.registerConfirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation registerResend
   */
  static readonly RegisterResendPath = '/users/register-resend';

  /**
   * Resend confirmation email.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerResend()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerResend$Response(
    params: {
      body: RegisterResendConfirmDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.RegisterResendPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Resend confirmation email.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registerResend$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerResend(
    params: {
      body: RegisterResendConfirmDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.registerResend$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation registerCancel
   */
  static readonly RegisterCancelPath = '/users/register-cancel';

  /**
   * Cancel registration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerCancel()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerCancel$Response(
    params: {
      body: RegisterCancelDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.RegisterCancelPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Cancel registration.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registerCancel$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerCancel(
    params: {
      body: RegisterCancelDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.registerCancel$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation changeEmail
   */
  static readonly ChangeEmailPath = '/users/{id}/change-email';

  /**
   * Change email address.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changeEmail()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeEmail$Response(
    params: {
      id: string;
      body: ChangeEmailDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ChangeEmailPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Change email address.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changeEmail$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeEmail(
    params: {
      id: string;
      body: ChangeEmailDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.changeEmail$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation confirmEmailChange
   */
  static readonly ConfirmEmailChangePath = '/users/{id}/confirm-email-change';

  /**
   * Confirm email address change.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `confirmEmailChange()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  confirmEmailChange$Response(
    params: {
      id: string;
      body: ConfirmEmailChangeDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ConfirmEmailChangePath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Confirm email address change.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `confirmEmailChange$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  confirmEmailChange(
    params: {
      id: string;
      body: ConfirmEmailChangeDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.confirmEmailChange$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation changePassword
   */
  static readonly ChangePasswordPath = '/users/{id}/change-password';

  /**
   * Change password.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword$Response(
    params: {
      id: string;
      body: ChangePasswordDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ChangePasswordPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Change password.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changePassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword(
    params: {
      id: string;
      body: ChangePasswordDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.changePassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation changeDisplayName
   */
  static readonly ChangeDisplayNamePath = '/users/{id}/change-display-name';

  /**
   * Change display name.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changeDisplayName()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeDisplayName$Response(
    params: {
      id: string;
      body: ChangeDisplayName;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ChangeDisplayNamePath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Change display name.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changeDisplayName$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeDisplayName(
    params: {
      id: string;
      body: ChangeDisplayName;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.changeDisplayName$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation deleteAccount
   */
  static readonly DeleteAccountPath = '/users/{id}/delete-account';

  /**
   * Delete account.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAccount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteAccount$Response(
    params: {
      id: string;
      body: DeleteAccountDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.DeleteAccountPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Delete account.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteAccount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteAccount(
    params: {
      id: string;
      body: DeleteAccountDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.deleteAccount$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation forgotPassword
   */
  static readonly ForgotPasswordPath = '/users/forgot-password';

  /**
   * Forgot password.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `forgotPassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  forgotPassword$Response(
    params: {
      body: ForgotPasswordDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ForgotPasswordPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Forgot password.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `forgotPassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  forgotPassword(
    params: {
      body: ForgotPasswordDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.forgotPassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }

  /**
   * Path part for operation resetPassword
   */
  static readonly ResetPasswordPath = '/users/reset-password';

  /**
   * Reset password.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `resetPassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resetPassword$Response(
    params: {
      body: ResetPasswordDto;
    },
    context?: HttpContext
  ): Observable<StrictHttpResponse<ResponseResult>> {
    const rb = new RequestBuilder(this.rootUrl, UsersApi.ResetPasswordPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ResponseResult>;
        })
      );
  }

  /**
   * Reset password.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `resetPassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resetPassword(
    params: {
      body: ResetPasswordDto;
    },
    context?: HttpContext
  ): Observable<ResponseResult> {
    return this.resetPassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<ResponseResult>) => r.body as ResponseResult)
    );
  }
}
