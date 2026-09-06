import {HttpErrorResponse, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {catchError, from, switchMap, throwError} from 'rxjs';

function addToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return req;

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  let _authService = inject(AuthService);

  const authReq = addToken(req, _authService.getAccessToken());

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        return from(_authService.refreshToken()).pipe(
          switchMap((success) => {
            if (success) {
              const retryReq = addToken(req, _authService.getAccessToken());
              return next(retryReq);
            }

            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
