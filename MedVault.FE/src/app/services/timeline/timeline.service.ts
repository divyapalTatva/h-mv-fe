import { inject, Injectable } from '@angular/core';
import { ApiService } from '../common/api.service';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../interfaces/response/response.interface';
import { API_ENDPOINTS } from '../../utils/api-endpoint.constant';
import { DropdownOption, PaginatedData } from '../../interfaces/general.interface';
import { PatientHistoryListRequest } from '../../interfaces/request/patienthistorylistrequest';
import { PatientHistoryListResponse } from '../../interfaces/response/patienthistorylistresponse';
import { PatientHistoryResponse } from '../../interfaces/response/patienthistoryresponse';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private readonly api = inject(ApiService);

  getAllPatientHistory(request: PatientHistoryListRequest): Observable<ResponseModel<PaginatedData<PatientHistoryListResponse>>> {
    return this.api.post<ResponseModel<PaginatedData<PatientHistoryListResponse>>>(
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

  addUpdatePatientHistory(formData: FormData): Observable<ResponseModel<number>> {
    return this.api.post<ResponseModel<number>>(API_ENDPOINTS.PatientHistory.savePatientHistory, formData);
  }

  getPatientHistoryById(id: number): Observable<ResponseModel<PatientHistoryResponse>> {
    return this.api.get<ResponseModel<PatientHistoryResponse>>(
      API_ENDPOINTS.PatientHistory.getPatientHistoryById.replace('{0}', id.toString()),
    );
  }

  getDocumentFile(filePath: string): Observable<Blob> {
    return this.api.downloadFile(`${API_ENDPOINTS.PatientHistory.getDocumentFile}?filePath=${encodeURIComponent(filePath)}`);
  }
}