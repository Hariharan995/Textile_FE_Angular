import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.isLoggedIn();
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.isLoggedIn();

  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.isLoggedIn();
  }

  protected isLoggedIn(): boolean {
    let auth = JSON.parse(localStorage.getItem('auth') || "no data");
    if (auth && typeof auth != 'string' && (auth.token !== "" || auth.token !== null)) {
      return true
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


}
