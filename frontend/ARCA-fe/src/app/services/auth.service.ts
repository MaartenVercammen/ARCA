import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {decodeJwt} from 'jose'

interface userDto {
  username: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _user: WritableSignal<undefined | string> = signal(undefined);

  public User = computed(() => this._user())

  public async login(username: string, password: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this._http.post<userDto>("http://localhost:8080/authentication/login", { username, password })
        .subscribe({
          next: (response: userDto) => {
            this._user.set(response.username);
            sessionStorage.setItem("accessToken", response.accessToken);
            sessionStorage.setItem("refreshToken", response.refreshToken);
            resolve(true);
          },
          error: (err) => {
            console.error(err);
            resolve(false);
          }
        });
    });
  }

  public refreshToken(): Promise<boolean> {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) return Promise.resolve(false);

    return new Promise((resolve) => {
      this._http.post<userDto>("http://localhost:8080/authentication/refresh", refreshToken)
        .subscribe({
          next: (response: userDto) => {
            sessionStorage.setItem("accessToken", response.accessToken);
            sessionStorage.setItem("refreshToken", response.refreshToken);
            resolve(true);
          },
          error: (err) => {
            console.error(err);
            this.logout();
            resolve(false);
          }
        });
    });
  }

  public isUserLoggedIn(): boolean {
    return sessionStorage.getItem("accessToken") !== null;
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem("accessToken");
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
    sessionStorage.removeItem("accessToken");
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
    return sessionStorage.getItem("refreshToken");
  }
}
