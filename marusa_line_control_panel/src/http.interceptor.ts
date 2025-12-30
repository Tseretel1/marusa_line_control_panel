import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem("token");

  if (!request.url.includes('https://api.cloudinary.com')) {
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } 
  else {
  }
  return next(request);
};
