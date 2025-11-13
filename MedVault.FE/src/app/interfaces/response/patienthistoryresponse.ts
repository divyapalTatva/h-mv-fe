export interface PatientHistoryResponse {
  doctorName: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  patientHistoryDocuments: PatientHistoryDocuments[];
}

export interface PatientHistoryDocuments {
  documentCategoryName: string;
  dateOfDocument: Date;
  filePath: string;
}