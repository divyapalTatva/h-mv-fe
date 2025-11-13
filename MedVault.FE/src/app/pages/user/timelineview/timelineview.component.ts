import { Component, HostListener, inject } from '@angular/core';
import { PatientHistoryRequest } from '../../../interfaces/request/patienthistoryrequest';
import { SORT_ORDER } from '../../../shared/enums/common-enum';
import { TimelineService } from '../../../services/timeline/timeline.service';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, SCROLL_OFFSET } from '../../../utils/constants';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../../../shared/shared-material-module';
import { DatePickerComponent } from "../../../shared/components/date-picker/date-picker.component";
import { SelectComponent } from '../../../shared/components/select/select.component';
import { PatientHistoryResponse } from '../../../interfaces/response/patienthistoryresponse';
import { DropdownOption } from '../../../interfaces/general.interface';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../../services/user/user.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-timelineview',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    DatePickerComponent,
    SelectComponent,
    ButtonComponent
  ],
  templateUrl: './timelineview.component.html',
  styleUrl: './timelineview.component.scss'
})
export class TimelineviewComponent {
  private readonly timelineService = inject(TimelineService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();

  // Filters
  createdDateControl = new FormControl<Date | null>(null);
  categoryTypeControl = new FormControl<number | null>(null);
  doctorControl = new FormControl<number | null>(null);

  pageIndex = DEFAULT_PAGE_INDEX;
  pageSize = DEFAULT_PAGE_SIZE;
  totalRecords = 0;
  isLoading = false;
  isEndOfList = false;
  today = new Date();
  patientHistoryList: PatientHistoryResponse[] = [];
  categoryTypeList: DropdownOption[] = [];
  doctorsList: DropdownOption[] = [];

  ngOnInit(): void {
    this.loadDropdownData();
    this.fetchPatientHistory();

    this.createdDateControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.fetchPatientHistory(true));
    this.categoryTypeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.fetchPatientHistory(true));
    this.doctorControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.fetchPatientHistory(true));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchPatientHistory(reset: boolean = true): void {
    if (reset) {
      this.pageIndex = 1;
      this.patientHistoryList = [];
      this.isEndOfList = false;
    }

    const requestPayload: PatientHistoryRequest = {
      searchQuery: '',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sortOrder: SORT_ORDER.DESCENDING,
      sortColumn: 'createdat',
      createdDate: this.formatDate(this.createdDateControl.value),
      categoryType: this.categoryTypeControl.value,
      docotorId: this.doctorControl.value,
    };
    
    this.isLoading = true;

    this.timelineService
      .getAllPatientHistory(requestPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const records = res.data.records || [];
          this.totalRecords = res.data.totalRecords || 0;

          // Append or replace records
          this.patientHistoryList = [...this.patientHistoryList, ...records];

          // Mark end of list if all records loaded
          const totalLoaded = this.patientHistoryList.length;
          this.isEndOfList = totalLoaded >= this.totalRecords;

          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  // 🔹 Listen for scroll and trigger pagination
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;
    const nearBottom = scrollPosition >= documentHeight - SCROLL_OFFSET;

    if (!this.isLoading && !this.isEndOfList && nearBottom) {
      this.pageIndex++;
      this.fetchPatientHistory(false);
    }
  }

  onFilterChange(): void {
    this.fetchPatientHistory(true);
  }

  loadDropdownData(): void {
    this.timelineService
      .getCategoryTypeForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.categoryTypeList = response.data.map((categoryType) => ({
              value: categoryType.value,
              label: categoryType.label,
            }));
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });

    this.userService
      .getDoctorsForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.doctorsList = response.data.map((doctor) => ({
              value: doctor.value,
              label: doctor.label,
            }));
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }

  clearFilters(): void {
    // Reset all filter controls
    this.createdDateControl.reset(null, { emitEvent: false });
    this.categoryTypeControl.reset(null, { emitEvent: false });
    this.doctorControl.reset(null, { emitEvent: false });

    // Re-fetch all data
    this.fetchPatientHistory(true);
  }

  private formatDate(date: any): string | null {
    if (!date) return null;

    // Convert to YYYY-MM-DD (local date only)
    const local = new Date(date);
    const year = local.getFullYear();
    const month = (local.getMonth() + 1).toString().padStart(2, '0');
    const day = local.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // send only date string
  }


}
