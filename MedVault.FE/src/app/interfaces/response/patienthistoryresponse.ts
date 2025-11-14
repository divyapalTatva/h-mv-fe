export interface PatientHistoryResponse {
  id: number;
  doctorId: number;
  title: string;
  description?: string;
  patientHistoryDocuments: PatientHistoryDocumentsResponse[];
}

export interface PatientHistoryDocumentsResponse {
  documentCategoryTypeId: number;
  dateOfDocument: string;   // ISO date string from API
  filePath: string;
}