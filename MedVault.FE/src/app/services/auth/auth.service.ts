import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../../interfaces/request/loginrequest';
import { API_ENDPOINTS } from '../../utils/api-endpoint.constant';
import { ApiService } from '../common/api.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../interfaces/response/response.interface';
import { LoginResponse } from '../../interfaces/response/loginresponse';
import { VerifyOtpRequest } from '../../interfaces/request/verifyotprequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  
  login(loginRequest: LoginRequest): Observable<ResponseModel<LoginResponse>> {
    return this.api.post<ResponseModel<LoginResponse>>(
      API_ENDPOINTS.Auth.login,
      loginRequest,
    );
  }

  verifyOtp(verifyOtpRequest: VerifyOtpRequest): Observable<ResponseModel<LoginResponse>> {
    debugger;
    return this.api.post<ResponseModel<LoginResponse>>(
      API_ENDPOINTS.Auth.verifyOtp,
      verifyOtpRequest,
    );
  }
}
