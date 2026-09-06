import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { decodeJwt } from 'jose';
import { ApiConnector } from '../../shared/connector/api.connector';
import { firstValueFrom } from 'rxjs';

interface userDto {
  username: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _api = inject(ApiConnector);
  private _user: WritableSignal<undefined | string> = signal(undefined);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  public User = computed(() => this._user());
  public isLoading = this._loading.asReadonly();
  public errorMessage = this._error.asReadonly();

  public async login(username: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this._api.post<{ username: string; password: string }, userDto>(
          '/authentication/login',
          { username, password },
        ),
      );
      this._user.set(response.username);
      sessionStorage.setItem('accessToken', response.accessToken);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      return true;
    } catch (err) {
      console.error(err);
      this._error.set('Login failed');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  public async refreshToken(): Promise<boolean> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(false);

    try {
      const response = await firstValueFrom(
        this._api.post<string, userDto>('/authentication/refresh', refreshToken),
      );
      sessionStorage.setItem('accessToken', response.accessToken);
      sessionStorage.setItem('refreshToken', response.refreshToken);
      return true;
    } catch (err) {
      console.error(err);
      this.logout();
      return false;
    }
  }

  public isUserLoggedIn(): boolean {
    return sessionStorage.getItem('accessToken') !== null;
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded = decodeJwt(token);

    if (decoded.exp === undefined) return new Date();

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  public isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    return !(date.valueOf() > new Date().valueOf());
  }

  public logout(): void {
    this._user.set(undefined);
    sessionStorage.removeItem('accessToken');
  }

  public getClaims(): any {
    const token = this.getAccessToken();
    if (!token) return null;

    return decodeJwt(token);
  }

  public hasRole(role: string): boolean {
    const claims = this.getClaims();
    if (!claims || !claims.roles) return false;
    return claims.roles.includes(role);
  }

  public getName(): string | null {
    const claims = this.getClaims();
    if (!claims || !claims.sub) return null;
    return claims.sub;
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }
}
