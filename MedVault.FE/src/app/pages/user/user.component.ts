import { Component } from '@angular/core';
import { CommonlayoutComponent } from '../../shared/layout/commonlayout/commonlayout.component';

@Component({
  selector: 'app-admin',
  imports: [CommonlayoutComponent],
  template: ` <app-commonlayout /> `,
})
export class UserComponent {}