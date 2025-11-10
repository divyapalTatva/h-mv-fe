import { BloodGroup, Gender } from "../../shared/enums/common-enum";

export interface UserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    password: string;
}


export interface PatientProfileRequest {
    dateOfBirth: Date | string; // use ISO string format for DateOnly (e.g., '2025-11-09')
    gender: Gender;
    bloodGroup: BloodGroup;
    emergencyContactName: string;
    emergencyContactNumber: number;
    allergies?: string | null;
}

export interface DoctorProfileRequest {
  specialization: string;
  registrationNumber: string;
  hospitalId: number;
}