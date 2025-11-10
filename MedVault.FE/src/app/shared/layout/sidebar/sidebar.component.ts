import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { MENU_CONFIG } from '../../../utils/menu.constant';
import { SharedMaterialModule } from '../../shared-material-module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../services/common/token.service';
import { UserRole } from '../../enums/common-enum';

@Component({
  selector: 'app-sidebar',
  imports: [SharedMaterialModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true;
  @Output() menuIconClickEvent = new EventEmitter();

  private readonly tokenService = inject(TokenService);

  routeConfig: any[] = [];
  currentlyOpenAccordion: number | null = null;
  isHandset$!: Observable<boolean>;

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    const role = this.tokenService.getUserRoleFromToken() as UserRole;
    this.routeConfig = MENU_CONFIG[role] ?? [];
  }

  onMenuClick() {
    this.menuIconClickEvent.emit();
  }
}
