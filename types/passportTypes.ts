export interface PassportReadData {
  name: string;
  lastName: string;
  birthDate: string;
  type: string;
  gender: string;
  issueDate?: string;
  endDate: string;
  citizenshipCountry: string;
  no: string;
}

export interface PassportReadResponse {
  success: boolean;
  passport: PassportReadData;
  message?: string;
}

export interface MappedPassportFields {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
}
