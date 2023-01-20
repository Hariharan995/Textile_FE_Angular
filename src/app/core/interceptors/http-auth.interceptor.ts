import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

import { exhaustMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let auth = JSON.parse(localStorage.getItem('auth') || "no data");
    let token = auth ? auth.token : null;

    if (token != null) {
      return next
        .handle(this.authorize(req, token))
        .pipe(catchError(this.handleError));
    }

    return next.handle(req).pipe(catchError(this.handleError));
  }

  protected authorize(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0 && error.error instanceof ProgressEvent) {
      return throwError(
        'Please check your internet connection or Something went wrong'
      );
    }

    if (error.error.message) {
      return throwError(error.error.message);
    }

    return throwError('Something went wrong');
  }
}
