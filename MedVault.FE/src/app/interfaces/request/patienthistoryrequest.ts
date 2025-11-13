import { PaginatedRequest } from "../general.interface";

export interface PatientHistoryRequest extends PaginatedRequest {
    createdDate?: string | null;   // nullable Date
    categoryType?: number | null;
    docotorId?: number | null;
}
