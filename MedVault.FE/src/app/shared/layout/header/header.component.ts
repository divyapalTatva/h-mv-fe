import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TokenService } from '../../../services/common/token.service';
import { Subject } from 'rxjs';
import { UserRole } from '../../enums/common-enum';
import { SharedMaterialModule } from "../../shared-material-module";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [SharedMaterialModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isHandset: boolean | null | undefined;
  @Output() menuIconClickEvent = new EventEmitter();

  private readonly tokenService = inject(TokenService);
  private readonly destroy$ = new Subject<void>();

  isAuthenticated = false;
  userRole: UserRole;
  username = '';
  isSidebarOpen = true;

  ngOnInit(): void {
    this.isAuthenticated = this.tokenService.isLoggedIn();
    this.userRole = this.tokenService.getUserRoleFromToken() as UserRole;
    this.username = this.tokenService.getUserNameFromToken();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.menuIconClickEvent.emit();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.tokenService.logout();
  }

  get userRoleName(): string {
    return UserRole[this.userRole] ?? '';
  }

}
