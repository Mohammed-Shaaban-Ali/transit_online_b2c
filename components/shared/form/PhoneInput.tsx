"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

const TOP_COUNTRY_CODES = [
  "us",
  "gb",
  "ae",
  "sa",
  "eg",
  "th",
  "sg",
  "my",
  "ph",
];

interface Country {
  code: string;
  name: string;
  dialCode: string;
  digits: { min: number; max: number };
}

const DEFAULT_DIGITS = { min: 7, max: 12 };

const COUNTRIES: Country[] = [
  {
    code: "af",
    name: "Afghanistan",
    dialCode: "93",
    digits: { min: 9, max: 9 },
  },
  { code: "al", name: "Albania", dialCode: "355", digits: { min: 9, max: 9 } },
  { code: "dz", name: "Algeria", dialCode: "213", digits: { min: 9, max: 9 } },
  {
    code: "as",
    name: "American Samoa",
    dialCode: "1684",
    digits: { min: 7, max: 7 },
  },
  { code: "ad", name: "Andorra", dialCode: "376", digits: { min: 6, max: 6 } },
  { code: "ao", name: "Angola", dialCode: "244", digits: { min: 9, max: 9 } },
  {
    code: "ag",
    name: "Antigua and Barbuda",
    dialCode: "1268",
    digits: { min: 7, max: 7 },
  },
  {
    code: "ar",
    name: "Argentina",
    dialCode: "54",
    digits: { min: 10, max: 11 },
  },
  { code: "am", name: "Armenia", dialCode: "374", digits: { min: 8, max: 8 } },
  { code: "au", name: "Australia", dialCode: "61", digits: { min: 9, max: 9 } },
  { code: "at", name: "Austria", dialCode: "43", digits: { min: 10, max: 11 } },
  {
    code: "az",
    name: "Azerbaijan",
    dialCode: "994",
    digits: { min: 9, max: 9 },
  },
  { code: "bs", name: "Bahamas", dialCode: "1242", digits: { min: 7, max: 7 } },
  { code: "bh", name: "Bahrain", dialCode: "973", digits: { min: 8, max: 8 } },
  {
    code: "bd",
    name: "Bangladesh",
    dialCode: "880",
    digits: { min: 10, max: 10 },
  },
  {
    code: "bb",
    name: "Barbados",
    dialCode: "1246",
    digits: { min: 7, max: 7 },
  },
  { code: "by", name: "Belarus", dialCode: "375", digits: { min: 9, max: 9 } },
  { code: "be", name: "Belgium", dialCode: "32", digits: { min: 9, max: 9 } },
  { code: "bz", name: "Belize", dialCode: "501", digits: { min: 7, max: 7 } },
  { code: "bj", name: "Benin", dialCode: "229", digits: { min: 8, max: 8 } },
  { code: "bt", name: "Bhutan", dialCode: "975", digits: { min: 8, max: 8 } },
  { code: "bo", name: "Bolivia", dialCode: "591", digits: { min: 8, max: 9 } },
  {
    code: "ba",
    name: "Bosnia and Herzegovina",
    dialCode: "387",
    digits: { min: 8, max: 8 },
  },
  { code: "bw", name: "Botswana", dialCode: "267", digits: { min: 8, max: 8 } },
  { code: "br", name: "Brazil", dialCode: "55", digits: { min: 10, max: 11 } },
  { code: "bn", name: "Brunei", dialCode: "673", digits: { min: 7, max: 7 } },
  { code: "bg", name: "Bulgaria", dialCode: "359", digits: { min: 9, max: 9 } },
  {
    code: "bf",
    name: "Burkina Faso",
    dialCode: "226",
    digits: { min: 8, max: 8 },
  },
  { code: "bi", name: "Burundi", dialCode: "257", digits: { min: 8, max: 8 } },
  {
    code: "cv",
    name: "Cabo Verde",
    dialCode: "238",
    digits: { min: 7, max: 7 },
  },
  { code: "kh", name: "Cambodia", dialCode: "855", digits: { min: 9, max: 9 } },
  { code: "cm", name: "Cameroon", dialCode: "237", digits: { min: 9, max: 9 } },
  { code: "ca", name: "Canada", dialCode: "1", digits: { min: 10, max: 10 } },
  {
    code: "cf",
    name: "Central African Republic",
    dialCode: "236",
    digits: { min: 8, max: 8 },
  },
  { code: "td", name: "Chad", dialCode: "235", digits: { min: 8, max: 8 } },
  { code: "cl", name: "Chile", dialCode: "56", digits: { min: 9, max: 9 } },
  { code: "cn", name: "China", dialCode: "86", digits: { min: 11, max: 11 } },
  {
    code: "co",
    name: "Colombia",
    dialCode: "57",
    digits: { min: 10, max: 10 },
  },
  { code: "km", name: "Comoros", dialCode: "269", digits: { min: 7, max: 7 } },
  { code: "cg", name: "Congo", dialCode: "242", digits: { min: 9, max: 9 } },
  {
    code: "cr",
    name: "Costa Rica",
    dialCode: "506",
    digits: { min: 8, max: 8 },
  },
  { code: "hr", name: "Croatia", dialCode: "385", digits: { min: 8, max: 9 } },
  { code: "cu", name: "Cuba", dialCode: "53", digits: { min: 8, max: 8 } },
  { code: "cy", name: "Cyprus", dialCode: "357", digits: { min: 8, max: 8 } },
  {
    code: "cz",
    name: "Czech Republic",
    dialCode: "420",
    digits: { min: 9, max: 9 },
  },
  { code: "dk", name: "Denmark", dialCode: "45", digits: { min: 8, max: 8 } },
  { code: "dj", name: "Djibouti", dialCode: "253", digits: { min: 8, max: 8 } },
  {
    code: "do",
    name: "Dominican Republic",
    dialCode: "1809",
    digits: { min: 7, max: 7 },
  },
  { code: "cd", name: "DR Congo", dialCode: "243", digits: { min: 9, max: 9 } },
  { code: "ec", name: "Ecuador", dialCode: "593", digits: { min: 9, max: 9 } },
  { code: "eg", name: "Egypt", dialCode: "20", digits: { min: 10, max: 10 } },
  {
    code: "sv",
    name: "El Salvador",
    dialCode: "503",
    digits: { min: 8, max: 8 },
  },
  {
    code: "gq",
    name: "Equatorial Guinea",
    dialCode: "240",
    digits: { min: 9, max: 9 },
  },
  { code: "er", name: "Eritrea", dialCode: "291", digits: { min: 7, max: 7 } },
  { code: "ee", name: "Estonia", dialCode: "372", digits: { min: 7, max: 8 } },
  { code: "sz", name: "Eswatini", dialCode: "268", digits: { min: 8, max: 8 } },
  { code: "et", name: "Ethiopia", dialCode: "251", digits: { min: 9, max: 9 } },
  { code: "fj", name: "Fiji", dialCode: "679", digits: { min: 7, max: 7 } },
  { code: "fi", name: "Finland", dialCode: "358", digits: { min: 9, max: 10 } },
  { code: "fr", name: "France", dialCode: "33", digits: { min: 9, max: 9 } },
  { code: "ga", name: "Gabon", dialCode: "241", digits: { min: 8, max: 8 } },
  { code: "gm", name: "Gambia", dialCode: "220", digits: { min: 7, max: 7 } },
  { code: "ge", name: "Georgia", dialCode: "995", digits: { min: 9, max: 9 } },
  { code: "de", name: "Germany", dialCode: "49", digits: { min: 10, max: 11 } },
  { code: "gh", name: "Ghana", dialCode: "233", digits: { min: 9, max: 9 } },
  { code: "gr", name: "Greece", dialCode: "30", digits: { min: 10, max: 10 } },
  {
    code: "gt",
    name: "Guatemala",
    dialCode: "502",
    digits: { min: 8, max: 8 },
  },
  { code: "gn", name: "Guinea", dialCode: "224", digits: { min: 9, max: 9 } },
  {
    code: "gw",
    name: "Guinea-Bissau",
    dialCode: "245",
    digits: { min: 9, max: 9 },
  },
  { code: "gy", name: "Guyana", dialCode: "592", digits: { min: 7, max: 7 } },
  { code: "ht", name: "Haiti", dialCode: "509", digits: { min: 8, max: 8 } },
  { code: "hn", name: "Honduras", dialCode: "504", digits: { min: 8, max: 8 } },
  {
    code: "hk",
    name: "Hong Kong",
    dialCode: "852",
    digits: { min: 8, max: 8 },
  },
  { code: "hu", name: "Hungary", dialCode: "36", digits: { min: 9, max: 9 } },
  { code: "is", name: "Iceland", dialCode: "354", digits: { min: 7, max: 7 } },
  { code: "in", name: "India", dialCode: "91", digits: { min: 10, max: 10 } },
  {
    code: "id",
    name: "Indonesia",
    dialCode: "62",
    digits: { min: 9, max: 12 },
  },
  { code: "ir", name: "Iran", dialCode: "98", digits: { min: 10, max: 10 } },
  { code: "iq", name: "Iraq", dialCode: "964", digits: { min: 10, max: 10 } },
  { code: "ie", name: "Ireland", dialCode: "353", digits: { min: 9, max: 9 } },
  { code: "il", name: "Israel", dialCode: "972", digits: { min: 9, max: 9 } },
  { code: "it", name: "Italy", dialCode: "39", digits: { min: 9, max: 11 } },
  {
    code: "ci",
    name: "Ivory Coast",
    dialCode: "225",
    digits: { min: 10, max: 10 },
  },
  { code: "jm", name: "Jamaica", dialCode: "1876", digits: { min: 7, max: 7 } },
  { code: "jp", name: "Japan", dialCode: "81", digits: { min: 10, max: 11 } },
  { code: "jo", name: "Jordan", dialCode: "962", digits: { min: 9, max: 9 } },
  {
    code: "kz",
    name: "Kazakhstan",
    dialCode: "7",
    digits: { min: 10, max: 10 },
  },
  { code: "ke", name: "Kenya", dialCode: "254", digits: { min: 9, max: 9 } },
  {
    code: "kp",
    name: "North Korea",
    dialCode: "850",
    digits: { min: 8, max: 10 },
  },
  {
    code: "kr",
    name: "South Korea",
    dialCode: "82",
    digits: { min: 10, max: 11 },
  },
  { code: "kw", name: "Kuwait", dialCode: "965", digits: { min: 8, max: 8 } },
  {
    code: "kg",
    name: "Kyrgyzstan",
    dialCode: "996",
    digits: { min: 9, max: 9 },
  },
  { code: "la", name: "Laos", dialCode: "856", digits: { min: 9, max: 9 } },
  { code: "lv", name: "Latvia", dialCode: "371", digits: { min: 8, max: 8 } },
  { code: "lb", name: "Lebanon", dialCode: "961", digits: { min: 7, max: 8 } },
  { code: "ls", name: "Lesotho", dialCode: "266", digits: { min: 8, max: 8 } },
  { code: "lr", name: "Liberia", dialCode: "231", digits: { min: 8, max: 9 } },
  { code: "ly", name: "Libya", dialCode: "218", digits: { min: 9, max: 9 } },
  {
    code: "li",
    name: "Liechtenstein",
    dialCode: "423",
    digits: { min: 7, max: 9 },
  },
  {
    code: "lt",
    name: "Lithuania",
    dialCode: "370",
    digits: { min: 8, max: 8 },
  },
  {
    code: "lu",
    name: "Luxembourg",
    dialCode: "352",
    digits: { min: 9, max: 9 },
  },
  { code: "mo", name: "Macao", dialCode: "853", digits: { min: 8, max: 8 } },
  {
    code: "mg",
    name: "Madagascar",
    dialCode: "261",
    digits: { min: 9, max: 9 },
  },
  { code: "mw", name: "Malawi", dialCode: "265", digits: { min: 9, max: 9 } },
  { code: "my", name: "Malaysia", dialCode: "60", digits: { min: 9, max: 10 } },
  { code: "mv", name: "Maldives", dialCode: "960", digits: { min: 7, max: 7 } },
  { code: "ml", name: "Mali", dialCode: "223", digits: { min: 8, max: 8 } },
  { code: "mt", name: "Malta", dialCode: "356", digits: { min: 8, max: 8 } },
  {
    code: "mr",
    name: "Mauritania",
    dialCode: "222",
    digits: { min: 8, max: 8 },
  },
  {
    code: "mu",
    name: "Mauritius",
    dialCode: "230",
    digits: { min: 8, max: 8 },
  },
  { code: "mx", name: "Mexico", dialCode: "52", digits: { min: 10, max: 10 } },
  { code: "md", name: "Moldova", dialCode: "373", digits: { min: 8, max: 8 } },
  { code: "mc", name: "Monaco", dialCode: "377", digits: { min: 8, max: 9 } },
  { code: "mn", name: "Mongolia", dialCode: "976", digits: { min: 8, max: 8 } },
  {
    code: "me",
    name: "Montenegro",
    dialCode: "382",
    digits: { min: 8, max: 8 },
  },
  { code: "ma", name: "Morocco", dialCode: "212", digits: { min: 9, max: 9 } },
  {
    code: "mz",
    name: "Mozambique",
    dialCode: "258",
    digits: { min: 9, max: 9 },
  },
  { code: "mm", name: "Myanmar", dialCode: "95", digits: { min: 9, max: 10 } },
  { code: "na", name: "Namibia", dialCode: "264", digits: { min: 9, max: 9 } },
  { code: "np", name: "Nepal", dialCode: "977", digits: { min: 10, max: 10 } },
  {
    code: "nl",
    name: "Netherlands",
    dialCode: "31",
    digits: { min: 9, max: 9 },
  },
  {
    code: "nz",
    name: "New Zealand",
    dialCode: "64",
    digits: { min: 8, max: 10 },
  },
  {
    code: "ni",
    name: "Nicaragua",
    dialCode: "505",
    digits: { min: 8, max: 8 },
  },
  { code: "ne", name: "Niger", dialCode: "227", digits: { min: 8, max: 8 } },
  {
    code: "ng",
    name: "Nigeria",
    dialCode: "234",
    digits: { min: 10, max: 10 },
  },
  {
    code: "mk",
    name: "North Macedonia",
    dialCode: "389",
    digits: { min: 8, max: 8 },
  },
  { code: "no", name: "Norway", dialCode: "47", digits: { min: 8, max: 8 } },
  { code: "om", name: "Oman", dialCode: "968", digits: { min: 8, max: 8 } },
  {
    code: "pk",
    name: "Pakistan",
    dialCode: "92",
    digits: { min: 10, max: 10 },
  },
  { code: "pa", name: "Panama", dialCode: "507", digits: { min: 8, max: 8 } },
  {
    code: "pg",
    name: "Papua New Guinea",
    dialCode: "675",
    digits: { min: 8, max: 8 },
  },
  { code: "py", name: "Paraguay", dialCode: "595", digits: { min: 9, max: 9 } },
  { code: "pe", name: "Peru", dialCode: "51", digits: { min: 9, max: 9 } },
  {
    code: "ph",
    name: "Philippines",
    dialCode: "63",
    digits: { min: 10, max: 10 },
  },
  { code: "pl", name: "Poland", dialCode: "48", digits: { min: 9, max: 9 } },
  { code: "pt", name: "Portugal", dialCode: "351", digits: { min: 9, max: 9 } },
  {
    code: "ps",
    name: "Palestine",
    dialCode: "970",
    digits: { min: 9, max: 9 },
  },
  {
    code: "pr",
    name: "Puerto Rico",
    dialCode: "1787",
    digits: { min: 7, max: 7 },
  },
  { code: "qa", name: "Qatar", dialCode: "974", digits: { min: 8, max: 8 } },
  { code: "ro", name: "Romania", dialCode: "40", digits: { min: 9, max: 9 } },
  { code: "ru", name: "Russia", dialCode: "7", digits: { min: 10, max: 10 } },
  { code: "rw", name: "Rwanda", dialCode: "250", digits: { min: 9, max: 9 } },
  { code: "ws", name: "Samoa", dialCode: "685", digits: { min: 7, max: 7 } },
  {
    code: "sm",
    name: "San Marino",
    dialCode: "378",
    digits: { min: 8, max: 10 },
  },
  {
    code: "sa",
    name: "Saudi Arabia",
    dialCode: "966",
    digits: { min: 9, max: 9 },
  },
  { code: "sn", name: "Senegal", dialCode: "221", digits: { min: 9, max: 9 } },
  { code: "rs", name: "Serbia", dialCode: "381", digits: { min: 9, max: 9 } },
  {
    code: "sl",
    name: "Sierra Leone",
    dialCode: "232",
    digits: { min: 8, max: 8 },
  },
  { code: "sg", name: "Singapore", dialCode: "65", digits: { min: 8, max: 8 } },
  { code: "sk", name: "Slovakia", dialCode: "421", digits: { min: 9, max: 9 } },
  { code: "si", name: "Slovenia", dialCode: "386", digits: { min: 8, max: 8 } },
  { code: "so", name: "Somalia", dialCode: "252", digits: { min: 9, max: 9 } },
  {
    code: "za",
    name: "South Africa",
    dialCode: "27",
    digits: { min: 9, max: 9 },
  },
  {
    code: "ss",
    name: "South Sudan",
    dialCode: "211",
    digits: { min: 9, max: 9 },
  },
  { code: "es", name: "Spain", dialCode: "34", digits: { min: 9, max: 9 } },
  { code: "lk", name: "Sri Lanka", dialCode: "94", digits: { min: 9, max: 9 } },
  { code: "sd", name: "Sudan", dialCode: "249", digits: { min: 9, max: 9 } },
  { code: "sr", name: "Suriname", dialCode: "597", digits: { min: 7, max: 7 } },
  { code: "se", name: "Sweden", dialCode: "46", digits: { min: 9, max: 9 } },
  {
    code: "ch",
    name: "Switzerland",
    dialCode: "41",
    digits: { min: 9, max: 9 },
  },
  { code: "sy", name: "Syria", dialCode: "963", digits: { min: 9, max: 9 } },
  { code: "tw", name: "Taiwan", dialCode: "886", digits: { min: 9, max: 9 } },
  {
    code: "tj",
    name: "Tajikistan",
    dialCode: "992",
    digits: { min: 9, max: 9 },
  },
  { code: "tz", name: "Tanzania", dialCode: "255", digits: { min: 9, max: 9 } },
  { code: "th", name: "Thailand", dialCode: "66", digits: { min: 9, max: 9 } },
  {
    code: "tl",
    name: "Timor-Leste",
    dialCode: "670",
    digits: { min: 8, max: 8 },
  },
  { code: "tg", name: "Togo", dialCode: "228", digits: { min: 8, max: 8 } },
  {
    code: "tt",
    name: "Trinidad and Tobago",
    dialCode: "1868",
    digits: { min: 7, max: 7 },
  },
  { code: "tn", name: "Tunisia", dialCode: "216", digits: { min: 8, max: 8 } },
  { code: "tr", name: "Turkey", dialCode: "90", digits: { min: 10, max: 10 } },
  {
    code: "tm",
    name: "Turkmenistan",
    dialCode: "993",
    digits: { min: 8, max: 8 },
  },
  { code: "ug", name: "Uganda", dialCode: "256", digits: { min: 9, max: 9 } },
  { code: "ua", name: "Ukraine", dialCode: "380", digits: { min: 9, max: 9 } },
  {
    code: "ae",
    name: "United Arab Emirates",
    dialCode: "971",
    digits: { min: 9, max: 9 },
  },
  {
    code: "gb",
    name: "United Kingdom",
    dialCode: "44",
    digits: { min: 10, max: 10 },
  },
  {
    code: "us",
    name: "United States",
    dialCode: "1",
    digits: { min: 10, max: 10 },
  },
  { code: "uy", name: "Uruguay", dialCode: "598", digits: { min: 8, max: 9 } },
  {
    code: "uz",
    name: "Uzbekistan",
    dialCode: "998",
    digits: { min: 9, max: 9 },
  },
  {
    code: "ve",
    name: "Venezuela",
    dialCode: "58",
    digits: { min: 10, max: 10 },
  },
  { code: "vn", name: "Vietnam", dialCode: "84", digits: { min: 9, max: 10 } },
  { code: "ye", name: "Yemen", dialCode: "967", digits: { min: 9, max: 9 } },
  { code: "zm", name: "Zambia", dialCode: "260", digits: { min: 9, max: 9 } },
  { code: "zw", name: "Zimbabwe", dialCode: "263", digits: { min: 9, max: 9 } },
];

export type PhoneCountry = Country;

export interface PhoneInputProps {
  value: string;
  onChange: (phone: string, dialCode: string, isValid: boolean) => void;
  label: string;
  error?: string;
  defaultCountryCode?: string;
}

function getDigitHint(digits: { min: number; max: number }): string {
  if (digits.min === digits.max) return `${digits.min} digits`;
  return `${digits.min}–${digits.max} digits`;
}

function validateLength(
  num: string,
  digits: { min: number; max: number },
): string | null {
  if (num.length === 0) return null;
  if (num.length < digits.min)
    return `Number must be at least ${digits.min} digits`;
  if (num.length > digits.max)
    return `Number must be at most ${digits.max} digits`;
  return null;
}

function CountryRow({
  country,
  isSelected,
  onSelect,
}: {
  country: Country;
  isSelected: boolean;
  onSelect: (c: Country) => void;
}) {
  return (
    <div
      onClick={() => onSelect(country)}
      className={`flex items-center gap-2 px-5 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-primary/5" : ""
      }`}
    >
      <span
        className={`text-14 ${isSelected ? "text-primary " : "text-gray-500"}`}
      >
        {country.name}
      </span>
      <span className="text-xs text-gray-500">+{country.dialCode}</span>
    </div>
  );
}

export default function PhoneInput({
  value,
  onChange,
  label,
  error,
  defaultCountryCode = "eg",
}: PhoneInputProps) {
  const defaultCountry =
    COUNTRIES.find((c) => c.code === defaultCountryCode) ??
    ({ ...COUNTRIES[0], digits: DEFAULT_DIGITS } as Country);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country>(defaultCountry);
  const [localNumber, setLocalNumber] = useState("");
  const [touched, setTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.startsWith("+")) {
      const sorted = [...COUNTRIES].sort(
        (a, b) => b.dialCode.length - a.dialCode.length,
      );
      const match = sorted.find((c) => value.startsWith(`+${c.dialCode}`));
      if (match) {
        setSelected(match);
        setLocalNumber(value.slice(match.dialCode.length + 1));
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topCountries = useMemo(
    () =>
      TOP_COUNTRY_CODES.map((code) =>
        COUNTRIES.find((c) => c.code === code),
      ).filter(Boolean) as Country[],
    [],
  );

  const groupedCountries = useMemo(() => {
    const filtered = COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dialCode.includes(search.replace("+", "")),
    );
    const groups: Record<string, Country[]> = {};
    for (const country of filtered) {
      const letter = country.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(country);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [search]);

  const lengthError = touched
    ? validateLength(localNumber, selected.digits)
    : null;
  const isValid =
    localNumber.length >= selected.digits.min &&
    localNumber.length <= selected.digits.max;
  const hasError = !!(error || lengthError);

  function selectCountry(country: Country) {
    setSelected(country);
    setOpen(false);
    setSearch("");
    const valid =
      localNumber.length >= country.digits.min &&
      localNumber.length <= country.digits.max;
    onChange(`+${country.dialCode}${localNumber}`, country.dialCode, valid);
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = e.target.value.replace(/\D/g, "");
    if (num.length > selected.digits.max) return;
    setLocalNumber(num);
    const valid =
      num.length >= selected.digits.min && num.length <= selected.digits.max;
    onChange(`+${selected.dialCode}${num}`, selected.dialCode, valid);
  }

  const isSelectedCountry = (c: Country) =>
    c.code === selected.code && c.dialCode === selected.dialCode;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="pointer-events-none absolute -top-2 start-3 z-10 rounded-md bg-white px-2 text-[12px] font-medium text-black/50">
        {label}
      </label>

      <div
        className={`flex items-center h-[58px] rounded-lg border bg-white overflow-hidden ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
        dir="ltr"
      >
        {/* Dial code button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 h-full border-e shrink-0 bg-white hover:bg-gray-50 transition-colors ${
            hasError ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span className="text-[15px] font-semibold text-slate-800 whitespace-nowrap">
            (+{selected.dialCode})
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Phone number input */}
        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          onBlur={() => setTouched(true)}
          placeholder={`${"0".repeat(selected.digits.min)}`}
          maxLength={selected.digits.max}
          className="flex-1 h-full px-3 text-[15px] font-medium text-slate-900 placeholder:text-gray-400 outline-none bg-transparent"
          autoComplete="tel-national"
        />

        {/* Digit counter */}
        {localNumber.length > 0 && (
          <span
            className={`px-2 text-xs shrink-0 ${
              isValid ? "text-green-500" : "text-gray-400"
            }`}
          >
            {localNumber.length}/
            {selected.digits.max === selected.digits.min
              ? selected.digits.max
              : `${selected.digits.min}–${selected.digits.max}`}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200
         bg-white shadow-xl overflow-hidden"
        >
          {/* Selected */}
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Selected
            </p>
            <div
              onClick={() => selectCountry(selected)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 cursor-pointer"
            >
              <span className="text-sm font-medium text-primary">
                {selected.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {getDigitHint(selected.digits)}
                </span>
                <span className="text-sm text-primary/70">
                  +{selected.dialCode}
                </span>
                <Check size={14} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Country or region"
                className="flex-1 text-sm outline-none bg-transparent text-slate-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto pb-2 mt-2">
            {groupedCountries.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">
                No results found
              </p>
            ) : (
              <>
                {!search && (
                  <div>
                    <p className="px-4 h-9 text-base font-bold flex items-center gap-2  bg-gray-100 uppercase tracking-wide">
                      Top
                    </p>
                    {topCountries.map((country) => (
                      <CountryRow
                        key={`top-${country.code}`}
                        country={country}
                        isSelected={isSelectedCountry(country)}
                        onSelect={selectCountry}
                      />
                    ))}
                  </div>
                )}

                {groupedCountries.map(([letter, countries]) => (
                  <div key={letter}>
                    <p className="px-4 h-9 text-base font-bold flex items-center gap-2  bg-gray-100 uppercase tracking-wide">
                      {letter}
                    </p>
                    {countries.map((country) => (
                      <CountryRow
                        key={`${country.code}-${country.dialCode}`}
                        country={country}
                        isSelected={isSelectedCountry(country)}
                        onSelect={selectCountry}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {(lengthError || error) && (
        <p className="text-13 text-red-500 mt-1.5 ms-1 flex items-center gap-1">
          <span className="inline-flex w-4 h-4 items-center justify-center rounded-full border border-red-500 text-[10px] font-bold">
            !
          </span>
          {lengthError ?? error}
        </p>
      )}
    </div>
  );
}
