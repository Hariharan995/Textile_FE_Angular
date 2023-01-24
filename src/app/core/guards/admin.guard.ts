import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserTypes } from 'src/app/models';
import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private authGuard: AuthGuard) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authGuard.canActivate(next, state) ? this.isAdmin() : false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authGuard.canActivateChild(next, state)
      ? this.isAdmin()
      : false;
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.authGuard.canLoad(route, segments) ? this.isAdmin() : false;
  }

  protected isAdmin(): boolean {
    let auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') || 'no data') : null;
    let userRole = auth ? auth.userRole[0] : null;

    switch (userRole) {
      case UserTypes.ADMIN:
        return true;
      case UserTypes.SELLER:
        return true;
      default:
        this.router.navigate(['/login']);
        return false;
    }
  }
}
