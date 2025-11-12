export const VALIDATION_MESSAGES = {
  email: {
    required: 'Email is required',
    pattern: 'Enter a valid email address',
  },
  newPassword: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters long',
    maxLength: 'Password cannot exceed 20 characters',
    pattern:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
  confirmPassword: {
    required: 'Confirm Password is required',
    match: 'Passwords do not match',
  },
  otp: {
    required: 'OTP is required',
    pattern: 'Enter a valid OTP',
  },
  firstName: {
    required: 'First Name is required',
    pattern: 'Enter a valid first name',
  },
  lastName: {
    required: 'Last Name is required',
    pattern: 'Enter a valid last name',
  },
  phoneNumber: {
    required: 'Phone number is required',
    pattern: 'Enter a valid phone number',
  },
  dateOfBirth: {
    required: 'Date of Birth is required.',
  },
  gender: {
    required: 'Gender is required.',
  },
  bloodGroup: {
    required: 'Blood Group is required.',
  },
  emergencyContactName: {
    required: 'Emergency contact name is required.',
    pattern: 'Enter a valid emergency contact name.',
  },
  emergencyContactNumber: {
    required: 'Emergency contact number is required.',
    pattern: 'Enter a valid 10-digit number.',
  },
  allergies: {
    maxlength: 'Maximum 1000 characters allowed.'
  },
  specialization: {
    required: 'Specialization is required.',
    maxlength: 'Maximum 250 characters allowed.'
  },
  registrationNumber: {
    required: 'Registration number is required.',
    maxlength: 'Maximum 50 characters allowed.'
  },
  hospital: {
    required: 'Hospital is required.'
  },
  descriptionValidationMessages: {
    required: 'Description is required.',
    maxlength: 'Description cannot exceed 250 characters.'
  },
  reminderTypeValidationMessages: {
    required: 'Reminder Type is required.',
  },
  reminderDateValidationMessages: {
    required: 'Reminder date is required.',
  },
  reminderTimeValidationMessages: {
    required: 'Reminder Time is required'
  }
};