import { PaginatedRequest } from "../general.interface";

export interface PatientHistoryListRequest extends PaginatedRequest {
    createdDate?: string | null;   // nullable Date
    categoryType?: number | null;
    docotorId?: number | null;
}
