import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../services/common/token.service';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { Subject, takeUntil } from 'rxjs';
import { BloodGroup, Gender, UserRole } from '../../shared/enums/common-enum';
import { enumToDropdownOptions, validations } from '../../utils/validators';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../shared/components/input/input.component';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { DropdownOption } from '../../interfaces/general.interface';
import { OnlyAlphabetDirective } from '../../shared/directives/only-alphabet.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-number.directive';
import { TextFieldComponent } from '../../shared/components/text-field/text-field.component';
import { VALIDATION_MESSAGES } from '../../utils/messages';
import { DoctorProfileRequest, PatientProfileRequest } from '../../interfaces/request/userrequest';
import { ResponseModel } from '../../interfaces/response/response.interface';
import { Navigation } from '../../shared/enums/navigation.enum';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [
    OnlyAlphabetDirective,
    OnlyNumbersDirective,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ErrorComponent,
    ButtonComponent,
    DatePickerComponent,
    SelectComponent,
    TextFieldComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly validation = inject(ValidationService);
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  public form!: FormGroup;
  public role!: UserRole;
  public hospitalsList: DropdownOption[] = [];
  UserRole = UserRole;
  today: Date = new Date();

  genderList: DropdownOption[] = enumToDropdownOptions(Gender);
  bloodGroupList: DropdownOption[] = enumToDropdownOptions(BloodGroup);

  // Validation messages
  dateOfBirthValidationMessages = {
    required: VALIDATION_MESSAGES.dateOfBirth.required,
  };

  genderValidationMessages = {
    required: VALIDATION_MESSAGES.gender.required,
  };

  bloodGroupValidationMessages = {
    required: VALIDATION_MESSAGES.bloodGroup.required,
  };

  emergencyContactNameValidationMessages = {
    required: VALIDATION_MESSAGES.emergencyContactName.required,
    pattern: VALIDATION_MESSAGES.emergencyContactName.pattern,
  };

  emergencyContactNumberValidationMessages = {
    required: VALIDATION_MESSAGES.emergencyContactNumber.required,
    pattern: VALIDATION_MESSAGES.emergencyContactNumber.pattern,
  };

  allergiesValidationMessages = {
    maxlength: VALIDATION_MESSAGES.allergies.maxlength
  };

  specializationValidationMessages = {
    required: VALIDATION_MESSAGES.specialization.required,
    maxlength: VALIDATION_MESSAGES.specialization.maxlength
  };

  registrationNumberValidationMessages = {
    required: VALIDATION_MESSAGES.registrationNumber.required,
    maxlength: VALIDATION_MESSAGES.registrationNumber.maxlength
  };

  hospitalValidationMessages = {
    required: VALIDATION_MESSAGES.hospital.required
  };

  constructor() {
    this.role = this.tokenService.getUserRoleFromToken() as UserRole;
    if (this.role === UserRole.Doctor) {
      this.createDoctorForm();
      this.loadHospitals();
    }
    if (this.role === UserRole.User) {
      this.createPatientForm();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createPatientForm() {
    this.form = this.formBuilder.group({
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      emergencyContactName: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          this.validation.whiteSpaceAndOnlySpecialCharcatersValidator()
        ],
      ],
      emergencyContactNumber: [
        '',
        [Validators.required, Validators.pattern(validations.common.mobileNumberREGEX)],
      ],
      allergies: ['', Validators.maxLength(1000)],
    });
  }

  private createDoctorForm() {
    this.form = this.formBuilder.group({
      specialization: [
        '',
        [Validators.required, Validators.maxLength(250)],
      ],
      registrationNumber: [
        '',
        [Validators.required, Validators.maxLength(50)],
      ],
      hospitalId: ['', Validators.required],
    });
  }

  private loadHospitals() {
    this.userService
      .getHospitalForDropdown()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.hospitalsList = response.data.map((hospital) => ({
              value: hospital.value,
              label: hospital.label,
            }));
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }

  private formatDateOnly(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    // Converts to yyyy-MM-dd format
    return d.toISOString().split('T')[0];
  }

  getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    if (this.role === UserRole.User) {
      const formattedDate = this.formatDateOnly(payload.dateOfBirth);

      const patientProfileRequest: PatientProfileRequest = {
        dateOfBirth: formattedDate,
        gender: payload.gender,
        bloodGroup: payload.bloodGroup,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactNumber: payload.emergencyContactNumber,
        allergies: payload.allergies
      };
      this.userService
        .addPatientProfile(patientProfileRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: ResponseModel<number>) => {
          if (response.result && response.data > 0) {
            this.snackbarService.success(response.messages);
            this.router.navigate([Navigation.User]);
          }
          else {
            this.snackbarService.error(response.messages);
          }
        });
    }
    else if (this.role === UserRole.Doctor) {

      const doctorProfileRequest: DoctorProfileRequest = {
        specialization: payload.specialization,
        registrationNumber: payload.registrationNumber,
        hospitalId: payload.hospitalId
      };

      this.userService
        .addDoctorProfile(doctorProfileRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: ResponseModel<number>) => {
          if (response.result && response.data > 0) {
            this.snackbarService.success(response.messages);
            this.router.navigate([Navigation.Doctor]);
          }
          else {
            this.snackbarService.error(response.messages);
          }
        });
    }
  }

  onCancel(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        alertType: 'warn', // can be 'danger', 'warn', 'info', 'success'
        message: 'Are you sure you want to cancel?',
        subMessage: 'Unsaved changes will be lost and you will log out.'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === null) { // 'Ok' button closes with null as per your dialog
        this.tokenService.logout();
      }
    });
  }
}
