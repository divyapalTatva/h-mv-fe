import { DropdownOption } from "../../interfaces/general.interface";

export enum UserRole {
    Admin = 1,
    Doctor = 2,
    User = 3
}

export enum Gender {
    Male = 1,
    Female = 2,
    Other = 3
}

export enum BloodGroup {
    APositive = 1,
    ANegative = 2,
    BPositive = 3,
    BNegative = 4,
    OPositive = 5,
    ONegative = 6,
    ABPositive = 7,
    ABNegative = 8
}

// export const GENDER_OPTIONS: DropdownOption[] = [
//   { value: 1, label: 'Male' },
//   { value: 2, label: 'Female' },
//   { value: 3, label: 'Other' },
// ];