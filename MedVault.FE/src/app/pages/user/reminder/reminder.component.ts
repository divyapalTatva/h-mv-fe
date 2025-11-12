import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../shared/shared-material-module';
import { AddreminderdialogComponent } from './addreminderdialog/addreminderdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { ReminderService } from '../../../services/reminder/reminder.service';
import { Subject, takeUntil } from 'rxjs';
import { ReminderType } from '../../../shared/enums/common-enum';
import { ResponseModel } from '../../../interfaces/response/response.interface';
import { AlertDialogComponent } from '../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-reminder',
  imports: [
    SharedMaterialModule,
    CommonModule,
    FullCalendarModule,
  ],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss'
})
export class ReminderComponent implements OnInit, OnDestroy {
  private readonly snackbarService = inject(SnackbarService);
  private readonly reminderService = inject(ReminderService);
  private readonly destroy$ = new Subject<void>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    selectMirror: true,
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDidMount: this.addDeleteIcon.bind(this),
    events: [],
    dayCellDidMount: (info) => {
      const cellDate = new Date(info.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 👇 Add gray style for past days
      if (cellDate < today) {
        info.el.classList.add('fc-day-past'); // Add CSS class
      }
    },
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.loadReminders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReminders() {
    // You can replace this with an API call
    this.reminderService
      .getAllReminder()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            const events = response.data.map(reminder => ({
              title: ReminderType[reminder.typeId],
              start: this.convetUTCToLocalDateTime(reminder.reminderDateTime),
              extendedProps: {
                reminderType: reminder.description,
                id: reminder.id
              }
            }));

            // Assign mapped events
            this.calendarOptions = { ...this.calendarOptions, events };
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }

  convetUTCToLocalDateTime(utcString: Date): string {
    const date = new Date(utcString + "Z");
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19);
  }

  openAddDialog() {
    this.openDialog(0, '')
  }

  onDateClick(info: any) {
    const selectedDate = new Date(info.dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return;
    }

    this.openDialog(0, selectedDate);
  }

  onEventClick(info: any) {
    this.openDialog(info.event.extendedProps.id, '');
  }

  openDialog(id: number, date: any) {
    const dialogRef = this.dialog.open(AddreminderdialogComponent, {
      width: '600px',
      data: { id: id, selectedDate: date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReminders();
      }
    });
  }

  addDeleteIcon(info: any) {
    const event = info.event;
    const eventDate = new Date(event.start);
    const now = new Date();

    // Only show for upcoming reminders
    if (eventDate < now) return;

    // Create a small cross icon element
    const cross = document.createElement('span');
    cross.innerHTML = '❌'; // × symbol
    cross.classList.add('fc-delete-cross');

    // Position it at the end of the event title
    cross.onclick = (e) => {
      e.stopPropagation(); // prevent opening dialog
      this.confirmDelete(event.extendedProps.id);
    };

    // Append to the event element
    info.el.appendChild(cross);
  }

  confirmDelete(id: number) {
    if (!id) return;

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        alertType: 'danger', // can be 'danger', 'warn', 'info', 'success'
        message: 'Are you sure you want to delete this reminder?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === null) { // 'Ok' button closes with null as per your dialog
        this.reminderService
          .deleteReminder(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response: ResponseModel<string>) => {
            if (response.result) {
              this.snackbarService.success(response.data);
              this.loadReminders();
            }
            else {
              this.snackbarService.error(response.messages);
            }
          });
      }
      else {
        return;
      }
    });
  }

}
