import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokSkipInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    headers: req.headers.set('ngrok-skip-browser-warning', 'true')
  });
  return next(modifiedReq);
};
