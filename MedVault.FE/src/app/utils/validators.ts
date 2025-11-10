import { DropdownOption } from "../interfaces/general.interface";

export const validations = {
  common: {
    emailREGEX: new RegExp('^(?!.*\\.\\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    mobileNumberREGEX: new RegExp(/^[6-9]\d{9}$/),
    otpREGEX: new RegExp(/^\d{6}$/),
    whitespaceREGEX: new RegExp(/^(\s+\S+\s*)*(?!\s).*$/),
    specialCharsREGEX: new RegExp(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/),
  },
};

export function isImageIcon(icon?: string): boolean {
  return !!icon?.match(/\.(png|jpe?g|svg|webp|gif)$/i);
}

export function enumToDropdownOptions(enumObj: Record<string, number | string>): DropdownOption[] {
  return Object.entries(enumObj)
    .filter(([_, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      value: value as number,
      label: key.replace(/([A-Z])/g, ' $1').trim() // adds spaces for readability
    }));
}