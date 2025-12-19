import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import { sessionExpired } from '@auth/store/auth.actions';
import { environment } from '@environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const http = inject(HttpClient);

  // Add withCredentials to all requests
  const clonedRequest = req.clone({
    withCredentials: true,
  });

  // Skip session expiration check for login and refresh endpoints
  if (
    req.url.includes('/authentication/login') ||
    req.url.includes('/authentication/refresh-token')
  ) {
    return next(clonedRequest);
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - Try to refresh token
      if (error.status === 401) {
        // Try to refresh token
        return http
          .post(`${environment.apiUrl}/authentication/refresh-token`, {}, { withCredentials: true })
          .pipe(
            switchMap(() => {
              // If refresh succeeds, retry the original request
              return next(clonedRequest);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              // If refresh fails with 401, session is expired
              if (refreshError.status === 401) {
                store.dispatch(sessionExpired());
              }
              return throwError(() => error); // Return original error
            }),
          );
      }

      return throwError(() => error);
    }),
  );
};
