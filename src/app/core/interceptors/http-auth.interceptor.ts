import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';

import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    let token = auth ? auth.token : null;

    if (token != null) {
      this.spinnerService.requestStarted();
      return this.handleError(next, this.authorize(request, token));
    }
    return this.handleError(next, request);
  }

  handleError(next: any, request: any) {
    return next.handle(request)
      .pipe(
        tap(
          (event: any) => {
            if (event instanceof HttpResponse) {
              this.spinnerService.requestEnded();
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === 0) {
              this.spinnerService.resetSpinner();
              throw 'Please check your internet connection or Something went wrong'
            }
            else if (error.error.message) {
              this.spinnerService.requestEnded();
              throw (error.error.message);
            }
            this.spinnerService.resetSpinner();
            throw 'Something went wrong';
          }
        )
      )
  }

  protected authorize(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
