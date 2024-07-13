import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorage } from '../constants/constants';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggeIn()){
    req = req.clone({
      setHeaders: {
        Authorization : `Bearer ${authService.getUserToken()}`,
        'Content-Type':'application/json'
      },
    })
  }

  return next(req).pipe(
    retry(2),
    catchError((e: HttpErrorResponse)=>{
      if(e.status == 401){
          localStorage.removeItem(LocalStorage.token);
          router.navigate(['']);
      }
      const error = e.error || e.statusText;
      return throwError(()=> error);
    })
  );
};
