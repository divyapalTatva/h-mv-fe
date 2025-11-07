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
};