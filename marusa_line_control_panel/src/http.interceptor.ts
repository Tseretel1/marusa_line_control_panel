import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './app/shared/services/auth.service';
export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const authService = inject(AuthService);
  function redirectToLogin(): void {
    authService.forceLogout();
  }
  if (!request.url.includes('https://api.cloudinary.com')) {
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        redirectToLogin();
      }
      return throwError(() => error);
    })
  );
  } 
  else {
  }
  return next(request);
};