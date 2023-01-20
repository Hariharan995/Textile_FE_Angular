import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpAuthInterceptor } from './http-auth.interceptor';

/**
 * "Barrel" of Http Interceptors
 */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
];

export * from './http-auth.interceptor';
