import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from '../../shared-material-module';
import {
  NgxMaterialTimepickerComponent,
  NgxMaterialTimepickerModule,
  NgxMaterialTimepickerTheme,
} from 'ngx-material-timepicker';

@Component({
  selector: 'app-time-picker',
  imports: [CommonModule, NgxMaterialTimepickerModule, SharedMaterialModule, ReactiveFormsModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {
  @ViewChild('toggleTimepicker') picker: NgxMaterialTimepickerComponent;
  @ViewChild('timePickerInput') timePickerInput: ElementRef<HTMLInputElement>;

  @Input() label: string | null;
  @Input() placeHolder: string = 'Start Time';
  @Input() timeControl: FormControl;
  @Input() disabled: boolean = false;
  @Input() minTime: string;
  @Input() maxTime: string;
  @Input() setTimeNowFlag: boolean = false;
  @Input() type: string = 'outlined';

  @Output() timeChange = new EventEmitter<string>();

  tooltipText: string = '';
  isValidCurrentTime: boolean = true;
  private isOpening = false;
  private openTimeout: any;

  theme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#2d61ac',
    },
    dial: {
      dialBackgroundColor: '#2d61ac',
    },
    clockFace: {
      clockFaceBackgroundColor: '#eaeaea',
      clockHandColor: '#2d61ac',
      clockFaceTimeInactiveColor: 'black',
      clockFaceTimeActiveColor: 'white',
    },
  };

  ngOnInit(): void {
    if (!this.timeControl) {
      this.timeControl = new FormControl();
    }
  }

  preventFocus(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const inputValue = this.timePickerInput?.nativeElement?.value ?? '';
    if (inputValue === '') {
      this.timePickerInput.nativeElement.blur();
    }
  }

  onOpenTimePicker() {
    if (this.disabled || this.isOpening) return;

    this.isOpening = true;

    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
    }

    this.openTimeout = setTimeout(() => {
      try {
        if (this.picker && !this.picker.open) {
          this.picker.open();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('TimePicker failed:', error);
      } finally {
        setTimeout(() => (this.isOpening = false), 300);
      }
    }, 100);
  }

  onTimePickerClosed() {
    this.isOpening = false;
    const inputValue = this.timePickerInput?.nativeElement?.value;

    if (!inputValue) {
      this.timePickerInput.nativeElement.blur();
    } else {
      this.timeChange.emit(inputValue);
    }
  }
}
