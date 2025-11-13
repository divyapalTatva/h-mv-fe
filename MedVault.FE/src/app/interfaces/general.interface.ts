import { SORT_ORDER } from "../shared/enums/common-enum";

export interface DropdownOption {
  label: string;
  value: string | number | boolean;
}

export interface PaginatedData<T> {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  records: T[];
}

export interface PaginatedRequest {
  searchQuery?: string;
  pageIndex?: number;
  pageSize?: number;
  sortOrder: SORT_ORDER;
  sortColumn?: string;
}
