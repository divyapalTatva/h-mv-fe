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

export enum ReminderType {
    LabTest = 1,
    Appointment = 2,
    Medicine = 3
}

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
    [BloodGroup.APositive]: 'A+',
    [BloodGroup.ANegative]: 'A-',
    [BloodGroup.BPositive]: 'B+',
    [BloodGroup.BNegative]: 'B-',
    [BloodGroup.OPositive]: 'O+',
    [BloodGroup.ONegative]: 'O-',
    [BloodGroup.ABPositive]: 'AB+',
    [BloodGroup.ABNegative]: 'AB-',
};

export enum SORT_ORDER {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}