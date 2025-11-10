import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SharedMaterialModule } from '../../shared-material-module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-commonlayout',
  imports: [HeaderComponent, SidebarComponent, SharedMaterialModule, CommonModule, RouterModule],
  templateUrl: './commonlayout.component.html',
  styleUrl: './commonlayout.component.scss'
})
export class CommonlayoutComponent {
  isSidebarOpen: boolean = true;
  isHandset$!: Observable<boolean>;

  constructor(private readonly breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(['(max-width: 1199px)']).pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  }
}
