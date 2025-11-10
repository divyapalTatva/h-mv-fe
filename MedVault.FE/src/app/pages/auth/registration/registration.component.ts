import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlyAlphabetDirective } from '../../../shared/directives/only-alphabet.directive';
import { InputComponent, InputConfig } from '../../../shared/components/input/input.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';
import { ValidationMessages, ValidationService } from '../../../shared/services/validation/validation.service';
import { validations } from '../../../utils/validators';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { VALIDATION_MESSAGES } from '../../../utils/messages';
import { UserService } from '../../../services/user/user.service';
import { UserRequest } from '../../../interfaces/request/userrequest';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from '../../../interfaces/response/response.interface';
import { Navigation } from '../../../shared/enums/navigation.enum';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { OnlyNumbersDirective } from '../../../shared/directives/only-number.directive';

@Component({
  selector: 'app-registration',
  imports: [
    OnlyAlphabetDirective,
    OnlyNumbersDirective,
    InputComponent,
    ErrorComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  public readonly validation = inject(ValidationService);
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  public form: FormGroup;

  passwordInputConfig: InputConfig = {
    key: 'password',
    label: 'Password',
    type: 'password',
    icon: 'visibility',
    placeholder: 'Enter your password',
  };

  confirmPasswordInputConfig: InputConfig = {
    key: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    icon: 'visibility',
    placeholder: 'Re-enter your password',
  };


  firstNameValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.firstName.required,
    pattern: VALIDATION_MESSAGES.firstName.pattern,
  };

  lastNameValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.lastName.required,
    pattern: VALIDATION_MESSAGES.lastName.pattern,
  };

  phoneNumberValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.phoneNumber.required,
    pattern: VALIDATION_MESSAGES.phoneNumber.pattern,
  };

  emailValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.email.required,
    pattern: VALIDATION_MESSAGES.email.pattern,
  };

  passwordValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.newPassword.required,
  };

  confirmPasswordValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.confirmPassword.required,
    mismatch: VALIDATION_MESSAGES.confirmPassword.match,
  };


  get firstNameControl() {
    return this.form.get('firstName') as FormControl;
  }

  get lastNameControl() {
    return this.form.get('lastName') as FormControl;
  }

  get emailControl() {
    return this.form.get('email') as FormControl;
  }

  get phoneNumberControl() {
    return this.form.get('phoneNumber') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }


  private createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
          this.validation.whiteSpaceAndOnlySpecialCharcatersValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
          this.validation.whiteSpaceAndOnlySpecialCharcatersValidator(),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(2),
          Validators.pattern(validations.common.emailREGEX),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(validations.common.mobileNumberREGEX)],
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() : void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {
    this.form = this.createForm();
  }

  onPasswordToggle() {
    if (this.passwordInputConfig.type === 'text') {
      this.passwordInputConfig.type = 'password';
      this.passwordInputConfig.icon = 'visibility';
    } else {
      this.passwordInputConfig.type = 'text';
      this.passwordInputConfig.icon = 'visibility_off';
    }
  }

  onConfirmPasswordToggle() {
    if (this.confirmPasswordInputConfig.type === 'text') {
      this.confirmPasswordInputConfig.type = 'password';
      this.confirmPasswordInputConfig.icon = 'visibility';
    } else {
      this.confirmPasswordInputConfig.type = 'text';
      this.confirmPasswordInputConfig.icon = 'visibility_off';
    }
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (confirmPassword && password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      // preserve other validation errors
      if (formGroup.get('confirmPassword')?.hasError('mismatch')) {
        formGroup.get('confirmPassword')?.updateValueAndValidity({ onlySelf: true });
      }
    }
    return null;
  }

  registration() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...payload } = this.form.value;
    const userRequest: UserRequest = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password
    };

    this.userService
      .registration(userRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: ResponseModel<string>) => {
        if (response.result && (response.data && response.data.trim() !== '')) {
          this.snackbarService.success(response.messages);
          this.router.navigate([Navigation.Login]);
        }
        else {
          this.snackbarService.error(response.messages);
        }
      });
  }

}
