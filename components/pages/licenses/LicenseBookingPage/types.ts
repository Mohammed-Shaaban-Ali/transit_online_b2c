export interface LicenseBookingFormValues {
  name: string;
  email: string;
  address: string;
  phone: string;
  phoneCountryCode: string;
  passportPhoto: File | null;
  localLicensePhoto: File | null;
  personalPhoto: File | null;
}

export const LICENSE_RESULT_PATH = "/licenses/result";
