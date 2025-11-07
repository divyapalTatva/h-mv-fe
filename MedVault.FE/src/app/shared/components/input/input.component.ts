import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface InputConfig {
  value?: string;
  key: string;
  label: string;
  type: string;
  readonly?: boolean;
  icon?: string;
  placeholder?: string;
}

@Component({
  selector: 'app-input',
  imports: [MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() config: InputConfig;
  @Input() control: FormControl;

  @Output() emitClickEvent = new EventEmitter<Event>();
  @Output() inputChangeEvent = new EventEmitter<string>();

  onIconClick(event: Event) {
    this.emitClickEvent.emit(event);
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.inputChangeEvent.emit(inputElement.value);
  }
}
