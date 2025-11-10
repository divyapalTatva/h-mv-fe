import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { SnackbarService } from '../shared/services/snackbar/snackbar.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const customError = {
        status: error.status,
        messages: ['An unexpected error occurred. Please try again later.'],
        metadata: null,
      };

      if (error.error) {
        if (Array.isArray(error.error.messages)) {
          customError.messages = error.error.messages;
        }

        if (error.error.metadata) {
          customError.metadata = error.error.metadata;
        }
      }

      // Show the snackbar message
      snackbarService.error(customError.messages.join(', '));

      // Still propagate the error to downstream subscribers
      return throwError(() => customError);
    }),
  );
};