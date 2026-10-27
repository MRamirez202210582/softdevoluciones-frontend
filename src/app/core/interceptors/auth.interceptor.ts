import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from "../../enviroments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token && req.url.startsWith(environment.apiUrl)) {
    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(request);
  }

  return next(req);
};
