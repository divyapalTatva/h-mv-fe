import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InputComponent, InputConfig } from "../../../shared/components/input/input.component";
import { ValidationMessages } from '../../../shared/services/validation/validation.service';
import { VALIDATION_MESSAGES } from '../../../utils/messages';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { validations } from '../../../utils/validators';
import { CommonModule } from '@angular/common';
import { Navigation } from '../../../shared/enums/navigation.enum';
import { ErrorComponent } from "../../../shared/components/error/error.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { LinkButtonComponent } from "../../../shared/components/link-button/link-button.component";
import { UserRole } from '../../../shared/enums/common-enum';
import { LoginRequest } from '../../../interfaces/request/loginrequest';
import { AuthService } from '../../../services/auth/auth.service';
import { ResponseModel } from '../../../interfaces/response/response.interface';
import { LoginResponse } from '../../../interfaces/response/loginresponse';
import { TokenService } from '../../../services/common/token.service';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ErrorComponent,
    ButtonComponent,
    LinkButtonComponent,
    VerifyOtpComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  readonly form: FormGroup;
  userRole: UserRole;
  showOtpScreen = false;
  otpUserId = '';


  emailInputConfig: InputConfig = {
    key: 'email',
    label: 'Email',
    type: 'text',
    icon: 'person',
    placeholder: 'Enter your email address',
  };

  emailValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.email.required,
    pattern: VALIDATION_MESSAGES.email.pattern,
  };

  passwordInputConfig: InputConfig = {
    key: 'password',
    label: 'Password',
    type: 'password',
    icon: 'visibility',
    placeholder: 'Enter your password',
  };

  passwordValidationMessages: ValidationMessages = {
    required: VALIDATION_MESSAGES.newPassword.required,
  };

  constructor() {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.userRole = this.route.snapshot.data['userRole'] ?? UserRole.User;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(validations.common.emailREGEX)]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
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

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    const loginRequest: LoginRequest = { email, password, role: this.userRole };

    this.authService
      .login(loginRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: ResponseModel<LoginResponse>) => {
        if (response.result) {
          if (response.data.isOtpSent) {
            this.showOtpScreen = true;
            this.otpUserId = response.data.userID;
          }
          else {
            this.handleSuccessfulLogin(response.data);
          }
        }
      });
  }

  navigateToRegister() {
    this.router.navigate([Navigation.Register]);
  }

  onOtpVerified(data: LoginResponse) {
    this.showOtpScreen = false;
    this.tokenService.saveTokens(data);
    this.handleSuccessfulLogin(data);
  }

  private handleSuccessfulLogin(data: LoginResponse) {
    this.tokenService.saveTokens(data);
    let role = this.tokenService.getUserRoleFromToken();

    let isProfileFilled = this.tokenService.isProfileFilled();
    if (role === UserRole.User) {
      this.router.navigate([isProfileFilled ? Navigation.User : Navigation.PatientProfile]);
    } else if (role === UserRole.Doctor) {
      this.router.navigate([isProfileFilled ? Navigation.Doctor : Navigation.DoctorProfile]);
    }
  }
}
