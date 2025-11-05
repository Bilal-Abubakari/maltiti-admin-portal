import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { sessionExpired } from '../auth/store/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Add withCredentials to all requests
  const clonedRequest = req.clone({
    withCredentials: true,
  });

  // Skip session expiration check for login endpoint
  if (req.url.includes('/authentication/login')) {
    return next(clonedRequest);
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - Session expired
      if (error.status === 401) {
        store.dispatch(
          sessionExpired()
        );
      }

      return throwError(() => error);
    })
  );
};

