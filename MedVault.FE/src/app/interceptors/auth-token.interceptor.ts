import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from '../services/common/token.service';
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (
  httpRequest: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);

  const accessToken = tokenService.getAccessToken();

  let authReq = httpRequest;
  if (accessToken) {
    authReq = httpRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        tokenService.logout();

        // Use a custom error message so errorHandlerInterceptor can detect it
        const sessionExpiredError = new HttpErrorResponse({
          error: {
            messages: ['Session expired. Please log in again.'],
          },
        });

        return throwError(() => sessionExpiredError);
      }

      return throwError(() => error);
    }),
  );
};
