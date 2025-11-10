import { ReminderType } from "../../shared/enums/common-enum";

export interface DashboardSummaryResponse {
  totalRecords: number;
  upcomingReminders: UpcomingReminder[];
  lastRecord: LastPatientRecord;
  totalCheckups: number;
  hospital: DoctorHospital;
}

export interface DoctorHospital {
  name: string;
  address: string;
  contactNumber: string;
}

export interface LastPatientRecord {
  date: Date;
  documentCount: number;
}

export interface UpcomingReminder {
  typeId: ReminderType;
  description?: string;
  reminderDateTime: Date;
}