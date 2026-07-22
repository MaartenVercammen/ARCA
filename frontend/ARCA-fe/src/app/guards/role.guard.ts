import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];

    if (!this._authService.isUserLoggedIn() || this._authService.isTokenExpired()) {
      void this._router.navigate(['/login']);
      return false;
    }

    if (requiredRole && !this._authService.hasRole(requiredRole)) {
      void this._router.navigate(['/home']); // Or an access denied page
      return false;
    }

    return true;
  }
}
