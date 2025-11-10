import { Component, Inject, inject, Injectable } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { STATIC_ASSETS } from '../../../utils/constants';

@Component({
  selector: 'app-snackbar-content',
  template: `
    <div class="custom-snackbar" [class]="data.type">
      <img [src]="data.iconPath" alt="" class="snackbar-icon" />
      <span class="message">{{ data.message }}</span>
    </div>
  `,
  styles: [
    `
      .custom-snackbar {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .snackbar-icon {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
      .message {
        flex: 1;
        color: #fff;
      }
    `,
  ],
})
export class SnackbarContentComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarContentComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackBar = inject(MatSnackBar);

  private readonly icons = {
    success: '../../../../assets/images/check.svg',
    error: '../../../../assets/images/remove.svg',
    warn: '../../../../assets/images/caution.svg',
    info: '../../../../assets/images/information.svg',
  };

  success(message: string) {
    this.showSnackbar(message, 'success', this.icons.success);
  }

  error(message: string) {
    this.showSnackbar(message, 'error', this.icons.error);
  }

  warn(message: string) {
    this.showSnackbar(message, 'warn', this.icons.warn);
  }

  info(message: string) {
    this.showSnackbar(message, 'info', this.icons.info);
  }

  showSnackbar(message: string, type: string, iconPath: string) {
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: STATIC_ASSETS.SNACKBAR_DURATION,
      panelClass: [type],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      data: {
        message,
        iconPath,
      },
    });
  }
}
