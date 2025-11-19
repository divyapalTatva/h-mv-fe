import { UserRole } from "../shared/enums/common-enum";
import { Navigation } from "../shared/enums/navigation.enum";

export const MENU_CONFIG = {
  [UserRole.Admin]: [
    {
      title: 'Dashboard',
      path: `${Navigation.Dashboard}`,
      icon: './assets/images/dashboard-grey.svg',
    },
    {
      title: 'Doctors',
      path: '/admin/doctors',
      icon: './assets/images/doctors.svg',
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: './assets/images/users.svg',
    },
  ],
  [UserRole.Doctor]: [
    {
      title: 'Dashboard',
      path: `${Navigation.Dashboard}`,
      icon: './assets/images/dashboard-grey.svg',
    },
  ],
  [UserRole.User]: [
    {
      title: 'Dashboard',
      path: `${Navigation.Dashboard}`,
      icon: './assets/images/dashboard-grey.svg',
    },
    {
      title: 'Medical History Timeline',
      path: `${Navigation.MedicalHistoryTimeline}`,
      icon: './assets/images/clock-grey.svg',
    },
    {
      title: 'Emergency Card',
      path: `${Navigation.EmergencyCard}`,
      icon: './assets/images/emergency.svg',
    },
    {
      title: 'Reminders',
      path: `${Navigation.Reminders}`,
      icon: './assets/images/datepicker-grey.svg',
    },
  ],
};