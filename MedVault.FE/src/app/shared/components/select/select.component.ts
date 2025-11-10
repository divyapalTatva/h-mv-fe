import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { DropdownOption } from '../../../interfaces/general.interface';

@Component({
  selector: 'app-select',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    OverlayModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input() label: string;
  @Input() control: FormControl;
  @Input() dropdownOptions: DropdownOption[] = [];
  @Input() customClass: string;
  @Output() selectionChanged = new EventEmitter<any>();

  selectionChangeEvent(event: MatSelectChange) {
    this.selectionChanged.emit(event);
  }
}
