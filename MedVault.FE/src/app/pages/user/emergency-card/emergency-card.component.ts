import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmergencyResponse } from '../../../interfaces/response/emergencyresponse';
import { UserService } from '../../../services/user/user.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { Subject, takeUntil } from 'rxjs';
import { BLOOD_GROUP_LABELS, BloodGroup, UserRole } from '../../../shared/enums/common-enum';

@Component({
  selector: 'app-emergency-card',
  imports: [],
  templateUrl: './emergency-card.component.html',
  styleUrl: './emergency-card.component.scss'
})
export class EmergencyCardComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly destroy$ = new Subject<void>();

  emergencyResponse: EmergencyResponse | null = null;

  ngOnInit(): void {
    this.getEmergencyDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEmergencyDetails(): void {
    this.userService
      .getEmergencyDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.emergencyResponse = response.data;
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }

  getBloodGroupLabel(value: number): string {
    return BLOOD_GROUP_LABELS[value as BloodGroup] ?? 'Unknown';
  }
}
