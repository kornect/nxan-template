import { Injectable } from '@angular/core';
import { BrowserStorage } from './browser-storage.service';

@Injectable()
export class SessionAuthStorage extends BrowserStorage {
  constructor() {
    super();
  }

  getStorage(): Storage {
    return sessionStorage;
  }
}
