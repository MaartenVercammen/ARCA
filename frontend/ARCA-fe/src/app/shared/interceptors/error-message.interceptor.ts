import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SystemMessageService } from '../service/system-message/system-message.service';

@Injectable()
export class ErrorMessageInterceptor implements HttpInterceptor {
  private _systemMessageService = inject(SystemMessageService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this._systemMessageService.show({
            message: error.error.message,
            type: 'success',
            duration: 5000,
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
