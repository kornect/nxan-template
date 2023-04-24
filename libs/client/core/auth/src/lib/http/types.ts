import { HttpContextToken } from '@angular/common/http';

/**
 * A token used to determine if the request should be authenticated.
 * That is, if the request should have an access token added to it.
 */
export const IS_AUTH_REQUIRED = new HttpContextToken<boolean>(() => false);
