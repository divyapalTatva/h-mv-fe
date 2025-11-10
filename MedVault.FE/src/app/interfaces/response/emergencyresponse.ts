import { BloodGroup, Gender } from "../../shared/enums/common-enum";

export interface EmergencyResponse {
    dateOfBirth: Date | string; // use ISO string format for DateOnly (e.g., '2025-11-09')
    gender: Gender;
    bloodGroup: BloodGroup;
    emergencyContactName: string;
    emergencyContactNumber: number;
    allergies?: string | null;
}