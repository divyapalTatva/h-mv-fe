import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../../../shared/shared-material-module';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { TextFieldComponent } from '../../../../shared/components/text-field/text-field.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { VALIDATION_MESSAGES } from '../../../../utils/messages';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { Subject, takeUntil } from 'rxjs';
import { DropdownOption } from '../../../../interfaces/general.interface';
import { InputComponent } from "../../../../shared/components/input/input.component";
import { TimelineService } from '../../../../services/timeline/timeline.service';
import { UserService } from '../../../../services/user/user.service';
import { ALLOWED_FILE_EXTENSIONS } from '../../../../utils/constants';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-addpatienthistory',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    ErrorComponent,
    DatePickerComponent,
    TextFieldComponent,
    ButtonComponent,
    SelectComponent,
    InputComponent,
    FileUploadComponent
  ],
  templateUrl: './addpatienthistory.component.html',
  styleUrl: './addpatienthistory.component.scss'
})
export class AddpatienthistoryComponent implements OnInit, OnDestroy {
  private readonly timelineService = inject(TimelineService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddpatienthistoryComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly destroy$ = new Subject<void>();

  documentCategoryList: DropdownOption[] = [];
  doctorsList: DropdownOption[] = [];
  allowedFileExtensions = ALLOWED_FILE_EXTENSIONS.accept;
  clickedButton = 'save';

  titleValidationMessages = {
    required: VALIDATION_MESSAGES.titleValidationMessages.required,
    pattern: VALIDATION_MESSAGES.titleValidationMessages.pattern,
  };

  doctorValidationMessages = {
    required: VALIDATION_MESSAGES.doctorValidationMessages.required,
  }

  documentCategoryTypeValidationMessages = {
    required: VALIDATION_MESSAGES.doctorValidationMessages.required,
  }

  dateOfDocumentValidationMessages = {
    required: VALIDATION_MESSAGES.dateOfDocumentValidationMessages.required,
  }

  form: FormGroup = this.fb.group({
    id: [0],
    doctorId: [null, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', Validators.maxLength(1000)],
    medicalDocuments: this.fb.array([])
  });

  get medicalDocuments(): FormArray {
    return this.form.get('medicalDocuments') as FormArray;
  }

  // constructor() {
  //   if (this.data?.medicalDocuments?.length) {
  //     this.data.medicalDocuments.forEach((doc: any) => this.addDocument(doc));
  //   } else {
  //     this.addDocument();
  //   }
  // }

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.data?.id > 0) {
      this.loadHistoryDetails(this.data.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownData(): void {
    this.timelineService
      .getCategoryTypeForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.documentCategoryList = response.data.map((categoryType) => ({
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

  loadHistoryDetails(id: number) {
    this.timelineService.getPatientHistoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            const d = response.data;

            this.form.patchValue({
              id: d.id,
              doctorId: d.doctorId,
              title: d.title,
              description: d.description
            });

            this.medicalDocuments.clear();

            if (d.patientHistoryDocuments?.length) {
              d.patientHistoryDocuments.forEach((doc: any) => {
                const utcDate = new Date(doc.dateOfDocument);

                // Convert to local date & time
                const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

                this.medicalDocuments.push(this.fb.group({
                  id: [doc.id],
                  documentCategoryId: [doc.documentCategoryId, Validators.required],
                  dateOfDocument: [localDate, Validators.required],
                  documentFile: [null],
                  existingFileName: [doc.filePath || null],
                  existingFileUrl: [doc.filePath || null]
                }));
              });
            } else {
              this.addDocument();
            }
          } else {
            this.snackbarService.error(response.messages);
          }
        }
      });
  }

  addDocument(doc: any = null) {
    const group = this.fb.group({
      id: [doc?.id || 0],
      documentCategoryId: [doc?.documentCategoryId || null, Validators.required],
      dateOfDocument: [doc?.dateOfDocument || null, Validators.required],
      documentFile: [doc?.documentFile || null]
    });
    this.medicalDocuments.push(group);
  }

  removeDocument(index: number) {
    this.medicalDocuments.removeAt(index);
  }

  onFileSelected(file: File, index: number) {
    this.medicalDocuments.at(index).get('documentFile')?.setValue(file);
  }

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

  onSubmit(action: string) {
    if (action === 'cancel') {
      this.onCancel();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const formData = new FormData();

    formData.append('Id', formValue.id);
    formData.append('DoctorId', formValue.doctorId);
    formData.append('Title', formValue.title);
    formData.append('Description', formValue.description || '');

    formValue.medicalDocuments.forEach((doc: any, index: number) => {
      formData.append(`MedicalDocumentes[${index}].Id`, doc.id);
      formData.append(`MedicalDocumentes[${index}].DocumentCategoryId`, doc.documentCategoryId);
      formData.append(`MedicalDocumentes[${index}].DateOfDocument`, this.formatDate(doc.dateOfDocument));

      if (doc.documentFile) {
        formData.append(`MedicalDocumentes[${index}].DocumentFile`, doc.documentFile);
      }
    });

    this.timelineService.addUpdatePatientHistory(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result) {
            this.snackbarService.success(response.messages);
            this.dialogRef.close(true);
          } else {
            this.snackbarService.error(response.messages);
          }
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private formatDate(date: any): string {
    if (!date) return '';

    // Convert to YYYY-MM-DD (local date only)
    const local = new Date(date);
    const year = local.getFullYear();
    const month = (local.getMonth() + 1).toString().padStart(2, '0');
    const day = local.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // send only date string
  }
}
