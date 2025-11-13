import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './app/shared/services/auth.service';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { AppRoutes } from './app/shared/AppRoutes/AppRoutes';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
 const authService = inject(AuthService);
  const token = localStorage.getItem("token");

  if (token) {
    request = request.clone({
      setHeaders: {
        "Authorization": `Bearer ${token}`,
        ...(request.headers.has('Toro') ? {} : {
          "Control-Allow-Origin": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json"
        })
      }
    });
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.error("Unauthorized or forbidden access.");
      }
      return throwError(() => error);
    }),
    finalize(() => {
      setTimeout(() => {
      });
    })
  );
  function redirectToLogin(): void {
  }
};
