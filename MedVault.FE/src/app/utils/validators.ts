export const validations = {
  common: {
    emailREGEX: new RegExp('^(?!.*\\.\\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    mobileNumberREGEX: new RegExp(/^[6-9]\d{9}$/),
    otpREGEX: new RegExp(/^\d{6}$/),
  },
};

export function isImageIcon(icon?: string): boolean {
  return !!icon?.match(/\.(png|jpe?g|svg|webp|gif)$/i);
}