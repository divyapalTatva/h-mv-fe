import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export interface ValidationMessages {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  getValidationMessage(
    formErrors: ValidationErrors | null,
    customMessageList?: ValidationMessages,
  ) {
    if (!formErrors) return '';

    const errorKeys = Object.keys(formErrors);

    if (customMessageList?.hasOwnProperty(errorKeys[0])) {
      return customMessageList[errorKeys[0]];
    }
    switch (errorKeys[0]) {
      case 'required':
        return 'This field is required';

      case 'minlength':
        return `Minimum length is ${formErrors['minlength'].requiredLength} characters`;

      case 'maxlength':
        return `Maximum length is ${formErrors['maxlength'].requiredLength} characters`;

      case 'pattern':
        return 'Invalid format';

      case 'whitespace':
        return 'White space is not allowed';

      case 'specialChars':
        return 'Only special characters are not allowed';

      case 'strongPassword':
        return 'Password must include an uppercase, a lowercase, a digit, and a special character.';

      case 'passwordMismatch':
        return 'Passwords do not match';

      case 'fileType': {
        const fileExtension = formErrors['fileType']['fileExtension'];
        const allowedExtensions = formErrors['fileType']['allowedExtensions']
          .map((ext: string) => `.${ext}`)
          .join(', ');
        return `Invalid file type ".${fileExtension}". Allowed types: ${allowedExtensions}`;
      }

      case 'multipleFileNotAllowed':
        return 'Multiple file not allowed. Please select only one file.';

      case 'maxLimit':
        return `Max allowed duration is: ${formErrors['maxLimit']}`;

      case 'min':
        return `Value must be greater than or equal to ${formErrors['min'].min}`;

      default:
        return 'Invalid input';
    }
  }
}
