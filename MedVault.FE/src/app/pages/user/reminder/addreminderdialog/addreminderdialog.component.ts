import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../../../shared/shared-material-module';
import { ErrorComponent } from '../../../../shared/components/error/error.component';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { TextFieldComponent } from '../../../../shared/components/text-field/text-field.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReminderType } from '../../../../shared/enums/common-enum';
import { DropdownOption } from '../../../../interfaces/general.interface';
import { enumToDropdownOptions } from '../../../../utils/validators';
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { ResponseModel } from '../../../../interfaces/response/response.interface';
import { Subject, takeUntil } from 'rxjs';
import { ReminderService } from '../../../../services/reminder/reminder.service';
import { ReminderRequest } from '../../../../interfaces/request/reminderrequest';
import { VALIDATION_MESSAGES } from '../../../../utils/messages';
import { TimePickerComponent } from "../../../../shared/components/time-picker/time-picker.component";

@Component({
  selector: 'app-addreminderdialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    ErrorComponent,
    DatePickerComponent,
    TextFieldComponent,
    ButtonComponent,
    SelectComponent,
    TimePickerComponent
  ],
  templateUrl: './addreminderdialog.component.html',
  styleUrl: './addreminderdialog.component.scss'
})
export class AddreminderdialogComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddreminderdialogComponent>);
  private readonly snackbarService = inject(SnackbarService);
  private readonly validation = inject(ValidationService);
  private readonly reminderService = inject(ReminderService);
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  today = new Date();
  reminderTypeList: DropdownOption[] = enumToDropdownOptions(ReminderType);
  clickedButton = 'save';

  public readonly reminderData = inject(MAT_DIALOG_DATA) as {
    id: number;
    selectedDate: string;
  };

  reminderDateValidationMessages = {
    required: VALIDATION_MESSAGES.reminderDateValidationMessages.required
  };

  reminderTimeValidationMessages = {
    required: VALIDATION_MESSAGES.reminderTimeValidationMessages.required
  };

  reminderTypeValidationMessages = {
    required: VALIDATION_MESSAGES.reminderTypeValidationMessages.required
  };

  descriptionValidationMessages = {
    required: VALIDATION_MESSAGES.descriptionValidationMessages.required,
    maxlength: VALIDATION_MESSAGES.descriptionValidationMessages.maxlength,
  };

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.reminderData.id > 0) {
      this.loadData(this.reminderData.id);
    }
    else {
      this.form.patchValue({
        reminderDate: this.reminderData.selectedDate
      });
    }
  }

  private loadData(id: number) {
    this.reminderService
      .getReminderById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {

            const utcDate = new Date(response.data.reminderDateTime);

            // Convert to local date & time
            const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
            const localTime = this.formatTime(localDate);

            this.form.patchValue({
              reminderDate: localDate,
              reminderTime: localTime,
              reminderType: response.data.typeId,
              description: response.data.description
            });
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }

  private createForm() {
    this.form = this.fb.group({
      reminderDate: ['', Validators.required],
      reminderTime: ['', Validators.required],
      reminderType: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250), this.validation.whiteSpaceAndOnlySpecialCharcatersValidator()]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  onSubmit(buttonType: string): void {
    if (buttonType === 'cancel') {
      this.onCancel();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    const reminderRequest: ReminderRequest = {
      id: this.reminderData.id,
      typeId: payload.reminderType,
      reminderDateTime: this.formatDateWithTime(payload.reminderDate, payload.reminderTime),
      description: payload.description,
    };

    if (this.reminderData.id > 0) {
      this.reminderService
        .updateReminder(reminderRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: ResponseModel<number>) => {
          if (response.result && response.data > 0) {
            this.dialogRef.close(true);
            this.snackbarService.success(response.messages);
          }
          else {
            this.snackbarService.error(response.messages);
          }
        });
    }
    else {
      this.reminderService
        .addReminder(reminderRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: ResponseModel<number>) => {
          if (response.result && response.data > 0) {
            this.dialogRef.close(true);
            this.snackbarService.success(response.messages);
          }
          else {
            this.snackbarService.error(response.messages);
          }
        });
    }

  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private formatDateWithTime(date: any, time: string): Date | string {
    if (!date || !time) return '';

    const selectedDate = new Date(date);

    // Parse the time (e.g. "1:06 PM")
    const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) return selectedDate;

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const meridian = timeParts[3].toUpperCase();

    // Convert 12-hour format to 24-hour
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    // Set hours and minutes without converting timezone
    selectedDate.setHours(hours, minutes, 0, 0);

    return selectedDate;
  }

  private formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  }
}
