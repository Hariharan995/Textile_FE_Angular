import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { httpInterceptorProviders } from './interceptors';
import { guards } from './guards';

@NgModule({  
  imports: [HttpClientModule],
  providers: [...httpInterceptorProviders, ...guards],
})
export class CoreModule {}
