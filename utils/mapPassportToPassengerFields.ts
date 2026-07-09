import type {
  MappedPassportFields,
  PassportReadData,
} from "@/types/passportTypes";
import { normalizeCountryCodeToAlpha2 } from "@/utils/normalizeCountryCode";
import { normalizeLatinName } from "@/utils/normalizeLatinName";

export function mapPassportToPassengerFields(
  passport: PassportReadData,
): MappedPassportFields {
  return {
    firstName: normalizeLatinName(passport.name || ""),
    lastName: normalizeLatinName(passport.lastName || ""),
    dateOfBirth: passport.birthDate || "",
    gender: passport.gender?.toLowerCase() === "female" ? "female" : "male",
    passportNumber: passport.no?.trim() || "",
    nationality: normalizeCountryCodeToAlpha2(
      passport.citizenshipCountry || "",
    ),
    passportExpiry: passport.endDate || "",
  };
}
