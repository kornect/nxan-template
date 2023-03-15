import { SetMetadata } from '@nestjs/common';

export const IS_ANONYMOUS_KEY = 'Anonymous';
export const AllowAnonymous = () => SetMetadata(IS_ANONYMOUS_KEY, true);
