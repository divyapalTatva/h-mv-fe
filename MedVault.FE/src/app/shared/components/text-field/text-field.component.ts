import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

export interface TextFieldConfig {
  value?: string;
  key: string;
  label: string;
  placeholder?: string;
  rows?: number;
  readonly?: boolean;
}

@Component({
  selector: 'app-text-field',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class TextFieldComponent {
  @Input() textFieldConfig?: TextFieldConfig;
  @Input() textFieldControl?: FormControl;
  @Output() textInputChange = new EventEmitter<string>();

  onTextInputChange(event: Event) {
    const textInputElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.textInputChange.emit(textInputElement.value);
  }
}
