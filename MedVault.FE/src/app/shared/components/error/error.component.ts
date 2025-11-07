import { Component, inject, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ValidationMessages, ValidationService } from '../../services/validation/validation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  imports: [MatFormFieldModule, CommonModule, ReactiveFormsModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  @Input() control: FormControl | null = null;
  @Input() customMessageList: ValidationMessages = {};

  validationService = inject(ValidationService);
}
