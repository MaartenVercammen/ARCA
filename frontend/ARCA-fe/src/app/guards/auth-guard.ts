import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) {}

  canActivate() {
    if (this.authService.isUserLoggedIn() && !this.authService.isTokenExpired()) {
      return true;
    }

    void this.router.navigate(['/login']);
    return false;
  }
}
