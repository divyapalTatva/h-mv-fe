import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl + '/api';
  const updatedReq = req.url.startsWith('http') ? req : req.clone({ url: `${baseUrl}${req.url}` });

  return next(updatedReq);
};
