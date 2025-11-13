import { inject, Injectable } from '@angular/core';
import { ApiService } from '../common/api.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../interfaces/response/response.interface';
import { API_ENDPOINTS } from '../../utils/api-endpoint.constant';
import { DropdownOption, PaginatedData } from '../../interfaces/general.interface';
import { PatientHistoryResponse } from '../../interfaces/response/patienthistoryresponse';
import { PatientHistoryRequest } from '../../interfaces/request/patienthistoryrequest';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private readonly api = inject(ApiService);

  getAllPatientHistory(request: PatientHistoryRequest): Observable<ResponseModel<PaginatedData<PatientHistoryResponse>>> {
    return this.api.post<ResponseModel<PaginatedData<PatientHistoryResponse>>>(
      API_ENDPOINTS.PatientHistory.getAllPatientHistory,
      request,
    );
  }

  getCategoryTypeForDropdown(): Observable<ResponseModel<DropdownOption[]>> {
    return this.api.get<ResponseModel<DropdownOption[]>>(
      API_ENDPOINTS.PatientHistory.getAllCategoryType
    );
  }

  getDoctorsForDropdown(): Observable<ResponseModel<DropdownOption[]>> {
    return this.api.get<ResponseModel<DropdownOption[]>>(
      API_ENDPOINTS.DoctorProfile.getDoctorsForDropdown
    );
  }
}
