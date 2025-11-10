import { Routes } from '@angular/router';
import { Navigation } from './shared/enums/navigation.enum';
import { UserRole } from './shared/enums/common-enum';
import { authGuard } from './guards/auth.guard';

const authRoutes: Routes = [
  {
    path: Navigation.Login,
    data: {},
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
  {
    path: Navigation.Register,
    data: {},
    loadComponent: () =>
      import('./pages/auth/registration/registration.component').then((m) => m.RegistrationComponent)
  },
];

const doctorRoutes: Routes = [
  {
    path: Navigation.Doctor,
    canActivate: [authGuard([UserRole.Doctor])],
    loadComponent: () =>
      import('./pages/user/user.component').then((m) => m.UserComponent),
    children: [
      {
        path: '',
        redirectTo: Navigation.Dashboard,
        pathMatch: 'full',
      },
      {
        path: Navigation.Dashboard,
        loadComponent: () =>
          import('./pages/user/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      // more admin routes
    ],
  },
];

const userRoutes: Routes = [
  {
    path: Navigation.User,
    canActivate: [authGuard([UserRole.User])],
    loadComponent: () =>
      import('./pages/user/user.component').then((m) => m.UserComponent),
    children: [
      {
        path: '',
        redirectTo: Navigation.Dashboard,
        pathMatch: 'full',
      },
      {
        path: Navigation.Dashboard,
        loadComponent: () =>
          import('./pages/user/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: Navigation.EmergencyCard,
        loadComponent: () =>
          import('./pages/user/emergency-card/emergency-card.component').then((m) => m.EmergencyCardComponent),
      },
      // more admin routes
    ],
  },
];

const profileRoutes: Routes = [
  {
    path: Navigation.PatientProfile,
    canActivate: [authGuard([UserRole.User])],
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: Navigation.DoctorProfile,
    canActivate: [authGuard([UserRole.Doctor])],
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
  },
];


export const routes: Routes = [
  { path: '', redirectTo: Navigation.Login, pathMatch: 'full' },
  ...authRoutes, // auth routes
  ...profileRoutes,
  ...doctorRoutes,
  ...userRoutes,
  { path: '**', redirectTo: '' }, // fallback route
];

