import { inject, Injectable } from '@angular/core';
import { ApiService } from '../common/api.service';
import { DoctorProfileRequest, PatientProfileRequest, UserRequest } from '../../interfaces/request/userrequest';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../interfaces/response/response.interface';
import { API_ENDPOINTS } from '../../utils/api-endpoint.constant';
import { DropdownOption } from '../../interfaces/general.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly api = inject(ApiService);

  registration(userRequest: UserRequest): Observable<ResponseModel<string>> {
    return this.api.post<ResponseModel<string>>(
      API_ENDPOINTS.User.userRegister,
      userRequest
    );
  }

  getHospitalForDropdown(): Observable<ResponseModel<DropdownOption[]>> {
    return this.api.get<ResponseModel<DropdownOption[]>>(
      API_ENDPOINTS.Hospital.getAllHospitals
    );
  }

  addPatientProfile(patientProfileRequest: PatientProfileRequest): Observable<ResponseModel<number>> {
    return this.api.post<ResponseModel<number>>(
      API_ENDPOINTS.PatientProfile.addPatientProfile,
      patientProfileRequest
    );
  }

  addDoctorProfile(doctorProfileRequest: DoctorProfileRequest): Observable<ResponseModel<number>> {
    return this.api.post<ResponseModel<number>>(
      API_ENDPOINTS.DoctorProfile.addDoctorProfile,
      doctorProfileRequest
    );
  }
}
