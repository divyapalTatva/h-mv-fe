import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReminderType, UserRole } from '../../../shared/enums/common-enum';
import { TokenService } from '../../../services/common/token.service';
import { Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../shared/shared-material-module';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedMaterialModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly dashboardService = inject(DashboardService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly destroy$ = new Subject<void>();

  public role!: UserRole;
  UserRole = UserRole;
  ReminderType = ReminderType;
  summaryData: any = {};

  ngOnInit(): void {
    this.role = this.tokenService.getUserRoleFromToken() as UserRole;
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.dashboardService
      .getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response?.result && response.data) {
            this.summaryData = response.data;
          } else {
            this.snackbarService.error(response.messages);
          }
        },
      });
  }
}
