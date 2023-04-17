import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

import { isNullOrEmpty } from '@nxan/shared/utils';

@Injectable()
export class HashService {
  public hashAsync(plain: string): Promise<string> {
    if (isNullOrEmpty(plain)) {
      throw new Error('Plain text cannot be null or empty');
    }
    return argon2.hash(plain);
  }

  public compareAsync(plain: string, hash: string): Promise<boolean> {
    if (isNullOrEmpty(plain)) {
      throw new Error('Plain text cannot be null or empty');
    }

    if (isNullOrEmpty(hash)) {
      throw new Error('Hash cannot be null or empty');
    }

    return argon2.verify(hash, plain);
  }
}
