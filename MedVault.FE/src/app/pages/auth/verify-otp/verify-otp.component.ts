import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LoginResponse } from '../../../interfaces/response/loginresponse';
import { AuthService } from '../../../services/auth/auth.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent, InputConfig } from "../../../shared/components/input/input.component";
import { ErrorComponent } from "../../../shared/components/error/error.component";
import { VerifyOtpRequest } from '../../../interfaces/request/verifyotprequest';
import { ResponseModel } from '../../../interfaces/response/response.interface';
import { ValidationMessages } from '../../../shared/services/validation/validation.service';
import { VALIDATION_MESSAGES } from '../../../utils/messages';
import { validations } from '../../../utils/validators';

@Component({
  selector: 'app-verify-otp',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, ErrorComponent],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  @Input() userID!: string;
  @Input() userRole!: number;
  @Output() otpVerified = new EventEmitter<LoginResponse>();

  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();
  private readonly formBuilder = inject(FormBuilder);

  readonly form: FormGroup;

  otpInputConfig: InputConfig = {
    key: 'otp',
    label: 'OTP',
    type: 'text',
    placeholder: 'Enter your OTP',
  };

  otpValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.otp.required,
    pattern: VALIDATION_MESSAGES.otp.pattern,
  };

  constructor() {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(validations.common.otpREGEX)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get otpControl(): FormControl {
    return this.form.get('otp') as FormControl;
  }

  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onOtpInput(event: any) {
    const value = event.target.value;
    if (value.length > 6) {
      event.target.value = value.slice(0, 6);
      this.otpControl.setValue(event.target.value);
    }
  }


  verifyOtp() {
    if (this.form.invalid) return;

    const { otp } = this.form.value;
    const verifyOtpRequest: VerifyOtpRequest = {
      userID: this.userID,
      otpCode: otp,
      role: this.userRole
    };

    this.authService.verifyOtp(verifyOtpRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: ResponseModel<LoginResponse>) => {
        if (response.result) {
          this.otpVerified.emit(response.data);
        }
      });
  }
}
