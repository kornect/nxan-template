import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  imports: [CommonModule],
})
export class ClientConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: ClientConfigModule) {
    if (parentModule) {
      throw new Error('ClientConfigModule is already loaded. Import in your base AppModule only.');
    }
  }

  static forRoot(): any {
    return {
      ngModule: ClientConfigModule,
      providers: [],
    };
  }
}
