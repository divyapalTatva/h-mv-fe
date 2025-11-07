import { Routes } from '@angular/router';
import { Navigation } from './shared/enums/navigation.enum';
import { UserRole } from './shared/enums/common-enum';

const authRoutes: Routes = [
  {
    path: Navigation.Login,
    data: { },
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: `${Navigation.Doctor}/${Navigation.Login}`,
    data: { userRole: UserRole.Doctor },
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: `${Navigation.Admins}/${Navigation.Login}`,
    data: { userRole: UserRole.Admin },
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
];


export const routes: Routes = [
  { path: '', redirectTo: Navigation.Login, pathMatch: 'full' },
  ...authRoutes, // auth routes
  { path: '**', redirectTo: '' }, // fallback route
];

