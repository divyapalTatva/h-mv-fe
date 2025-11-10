import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedMaterialModule } from '../../shared-material-module';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  imports: [SharedMaterialModule, CommonModule, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  @Input() label: string | null;
  @Input() placeHolder: string;
  @Input() dateControl: FormControl;
  @Input() disabled: boolean = true;
  @Input() needHint: boolean = true;
  @Input() hintText: string = 'Example: 06/24/2025';
  @Input() maxDate: Date | null = null;
  @Input() minDate: Date | null = null;
  @Input() disableDateList: Date[] = [];
  @Input() daysOfWeekend: number[] = []; // 0 (Sun) to 6 (Sat)
  @Input() customClass: string;

  @Output() changeEvent = new EventEmitter<Date>();
  @ViewChild('picker') picker: MatDatepicker<Date>;

  private readonly weekendCache = new Map<number, Date[]>();

  ngOnInit(): void {
    if (!this.dateControl) {
      this.dateControl = new FormControl();
    }
  }

  openPicker(): void {
    if (!this.disabled) {
      this.picker.open();
    }
  }

  private getAllWeekendsOfYear(year: number): Date[] {
    if (this.weekendCache.has(year)) {
      return this.weekendCache.get(year)!;
    }

    const weekends: Date[] = [];
    const date = new Date(year, 0, 1);
    while (date.getFullYear() === year) {
      if (this.daysOfWeekend.includes(date.getDay())) {
        weekends.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    this.weekendCache.set(year, weekends);
    return weekends;
  }

  private isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  myDateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const year = d.getFullYear();
    const weekends = this.getAllWeekendsOfYear(year);

    const isDisabled = this.disableDateList
      .map((date) => new Date(date))
      .some((disabledDate) => this.isSameDate(disabledDate, d));

    const isWeekend = weekends.some((weekendDate) => this.isSameDate(weekendDate, d));

    return !(isWeekend || isDisabled);
  };

  onSelectionChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.changeEvent.emit(event.value);
    }
  }

  onClear($event: Event): void {
    $event.stopPropagation();
    this.dateControl.reset();
  }
}
