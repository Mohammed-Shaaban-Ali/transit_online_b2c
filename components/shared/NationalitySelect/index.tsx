"use client";

import { useLocale } from "next-intl";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

// ─── Country type ───────────────────────────────────────────────
export interface CountryItem {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
}

// ─── Static countries list – Arab countries first (Saudi Arabia on top) ──
const COUNTRIES: CountryItem[] = [
  // ── Arab Countries ──────────────────────────────────────────
  { code: "SA", name: "Saudi Arabia", nameAr: "المملكة العربية السعودية", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة", flag: "🇦🇪" },
  { code: "KW", name: "Kuwait", nameAr: "الكويت", flag: "🇰🇼" },
  { code: "QA", name: "Qatar", nameAr: "قطر", flag: "🇶🇦" },
  { code: "BH", name: "Bahrain", nameAr: "البحرين", flag: "🇧🇭" },
  { code: "OM", name: "Oman", nameAr: "عُمان", flag: "🇴🇲" },
  { code: "EG", name: "Egypt", nameAr: "مصر", flag: "🇪🇬" },
  { code: "JO", name: "Jordan", nameAr: "الأردن", flag: "🇯🇴" },
  { code: "IQ", name: "Iraq", nameAr: "العراق", flag: "🇮🇶" },
  { code: "LB", name: "Lebanon", nameAr: "لبنان", flag: "🇱🇧" },
  { code: "SY", name: "Syria", nameAr: "سوريا", flag: "🇸🇾" },
  { code: "PS", name: "Palestine", nameAr: "فلسطين", flag: "🇵🇸" },
  { code: "YE", name: "Yemen", nameAr: "اليمن", flag: "🇾🇪" },
  { code: "LY", name: "Libya", nameAr: "ليبيا", flag: "🇱🇾" },
  { code: "TN", name: "Tunisia", nameAr: "تونس", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", nameAr: "الجزائر", flag: "🇩🇿" },
  { code: "MA", name: "Morocco", nameAr: "المغرب", flag: "🇲🇦" },
  { code: "SD", name: "Sudan", nameAr: "السودان", flag: "🇸🇩" },
  { code: "SO", name: "Somalia", nameAr: "الصومال", flag: "🇸🇴" },
  { code: "MR", name: "Mauritania", nameAr: "موريتانيا", flag: "🇲🇷" },
  { code: "DJ", name: "Djibouti", nameAr: "جيبوتي", flag: "🇩🇯" },
  { code: "KM", name: "Comoros", nameAr: "جزر القمر", flag: "🇰🇲" },

  // ── Rest of the World (Alphabetical) ────────────────────────
  { code: "AF", name: "Afghanistan", nameAr: "أفغانستان", flag: "🇦🇫" },
  { code: "AL", name: "Albania", nameAr: "ألبانيا", flag: "🇦🇱" },
  { code: "AD", name: "Andorra", nameAr: "أندورا", flag: "🇦🇩" },
  { code: "AO", name: "Angola", nameAr: "أنغولا", flag: "🇦🇴" },
  { code: "AG", name: "Antigua and Barbuda", nameAr: "أنتيغوا وبربودا", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", nameAr: "الأرجنتين", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", nameAr: "أرمينيا", flag: "🇦🇲" },
  { code: "AU", name: "Australia", nameAr: "أستراليا", flag: "🇦🇺" },
  { code: "AT", name: "Austria", nameAr: "النمسا", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", nameAr: "أذربيجان", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", nameAr: "الباهاما", flag: "🇧🇸" },
  { code: "BD", name: "Bangladesh", nameAr: "بنغلاديش", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", nameAr: "بربادوس", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", nameAr: "بيلاروس", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", nameAr: "بلجيكا", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", nameAr: "بليز", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", nameAr: "بنين", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", nameAr: "بوتان", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", nameAr: "بوليفيا", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", nameAr: "البوسنة والهرسك", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", nameAr: "بوتسوانا", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", nameAr: "البرازيل", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", nameAr: "بروناي", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", nameAr: "بلغاريا", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", nameAr: "بوركينا فاسو", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", nameAr: "بوروندي", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", nameAr: "الرأس الأخضر", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", nameAr: "كمبوديا", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", nameAr: "الكاميرون", flag: "🇨🇲" },
  { code: "CA", name: "Canada", nameAr: "كندا", flag: "🇨🇦" },
  { code: "CF", name: "Central African Republic", nameAr: "جمهورية أفريقيا الوسطى", flag: "🇨🇫" },
  { code: "TD", name: "Chad", nameAr: "تشاد", flag: "🇹🇩" },
  { code: "CL", name: "Chile", nameAr: "تشيلي", flag: "🇨🇱" },
  { code: "CN", name: "China", nameAr: "الصين", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", nameAr: "كولومبيا", flag: "🇨🇴" },
  { code: "CG", name: "Congo", nameAr: "الكونغو", flag: "🇨🇬" },
  { code: "CD", name: "Congo (DRC)", nameAr: "الكونغو الديمقراطية", flag: "🇨🇩" },
  { code: "CR", name: "Costa Rica", nameAr: "كوستاريكا", flag: "🇨🇷" },
  { code: "CI", name: "Côte d'Ivoire", nameAr: "ساحل العاج", flag: "🇨🇮" },
  { code: "HR", name: "Croatia", nameAr: "كرواتيا", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", nameAr: "كوبا", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", nameAr: "قبرص", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", nameAr: "التشيك", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", nameAr: "الدنمارك", flag: "🇩🇰" },
  { code: "DM", name: "Dominica", nameAr: "دومينيكا", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", nameAr: "جمهورية الدومينيكان", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", nameAr: "الإكوادور", flag: "🇪🇨" },
  { code: "SV", name: "El Salvador", nameAr: "السلفادور", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", nameAr: "غينيا الاستوائية", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", nameAr: "إريتريا", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", nameAr: "إستونيا", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", nameAr: "إسواتيني", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", nameAr: "إثيوبيا", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", nameAr: "فيجي", flag: "🇫🇯" },
  { code: "FI", name: "Finland", nameAr: "فنلندا", flag: "🇫🇮" },
  { code: "FR", name: "France", nameAr: "فرنسا", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", nameAr: "الغابون", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", nameAr: "غامبيا", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", nameAr: "جورجيا", flag: "🇬🇪" },
  { code: "DE", name: "Germany", nameAr: "ألمانيا", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", nameAr: "غانا", flag: "🇬🇭" },
  { code: "GR", name: "Greece", nameAr: "اليونان", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", nameAr: "غرينادا", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", nameAr: "غواتيمالا", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", nameAr: "غينيا", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", nameAr: "غينيا بيساو", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", nameAr: "غيانا", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", nameAr: "هايتي", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", nameAr: "هندوراس", flag: "🇭🇳" },
  { code: "HU", name: "Hungary", nameAr: "المجر", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", nameAr: "آيسلندا", flag: "🇮🇸" },
  { code: "IN", name: "India", nameAr: "الهند", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", nameAr: "إندونيسيا", flag: "🇮🇩" },
  { code: "IR", name: "Iran", nameAr: "إيران", flag: "🇮🇷" },
  { code: "IE", name: "Ireland", nameAr: "أيرلندا", flag: "🇮🇪" },
  { code: "IL", name: "Israel", nameAr: "إسرائيل", flag: "🇮🇱" },
  { code: "IT", name: "Italy", nameAr: "إيطاليا", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", nameAr: "جامايكا", flag: "🇯🇲" },
  { code: "JP", name: "Japan", nameAr: "اليابان", flag: "🇯🇵" },
  { code: "KZ", name: "Kazakhstan", nameAr: "كازاخستان", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", nameAr: "كينيا", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", nameAr: "كيريباتي", flag: "🇰🇮" },
  { code: "KP", name: "North Korea", nameAr: "كوريا الشمالية", flag: "🇰🇵" },
  { code: "KR", name: "South Korea", nameAr: "كوريا الجنوبية", flag: "🇰🇷" },
  { code: "XK", name: "Kosovo", nameAr: "كوسوفو", flag: "🇽🇰" },
  { code: "KG", name: "Kyrgyzstan", nameAr: "قيرغيزستان", flag: "🇰🇬" },
  { code: "LA", name: "Laos", nameAr: "لاوس", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", nameAr: "لاتفيا", flag: "🇱🇻" },
  { code: "LS", name: "Lesotho", nameAr: "ليسوتو", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", nameAr: "ليبيريا", flag: "🇱🇷" },
  { code: "LI", name: "Liechtenstein", nameAr: "ليختنشتاين", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", nameAr: "ليتوانيا", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", nameAr: "لوكسمبورغ", flag: "🇱🇺" },
  { code: "MG", name: "Madagascar", nameAr: "مدغشقر", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", nameAr: "مالاوي", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", nameAr: "ماليزيا", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", nameAr: "المالديف", flag: "🇲🇻" },
  { code: "ML", name: "Mali", nameAr: "مالي", flag: "🇲🇱" },
  { code: "MT", name: "Malta", nameAr: "مالطا", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", nameAr: "جزر مارشال", flag: "🇲🇭" },
  { code: "MU", name: "Mauritius", nameAr: "موريشيوس", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", nameAr: "المكسيك", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", nameAr: "ميكرونيزيا", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", nameAr: "مولدوفا", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", nameAr: "موناكو", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", nameAr: "منغوليا", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", nameAr: "الجبل الأسود", flag: "🇲🇪" },
  { code: "MZ", name: "Mozambique", nameAr: "موزمبيق", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", nameAr: "ميانمار", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", nameAr: "ناميبيا", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", nameAr: "ناورو", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", nameAr: "نيبال", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", nameAr: "هولندا", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", nameAr: "نيوزيلندا", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", nameAr: "نيكاراغوا", flag: "🇳🇮" },
  { code: "NE", name: "Niger", nameAr: "النيجر", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", nameAr: "نيجيريا", flag: "🇳🇬" },
  { code: "MK", name: "North Macedonia", nameAr: "مقدونيا الشمالية", flag: "🇲🇰" },
  { code: "NO", name: "Norway", nameAr: "النرويج", flag: "🇳🇴" },
  { code: "PK", name: "Pakistan", nameAr: "باكستان", flag: "🇵🇰" },
  { code: "PW", name: "Palau", nameAr: "بالاو", flag: "🇵🇼" },
  { code: "PA", name: "Panama", nameAr: "بنما", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", nameAr: "بابوا غينيا الجديدة", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", nameAr: "باراغواي", flag: "🇵🇾" },
  { code: "PE", name: "Peru", nameAr: "بيرو", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", nameAr: "الفلبين", flag: "🇵🇭" },
  { code: "PL", name: "Poland", nameAr: "بولندا", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", nameAr: "البرتغال", flag: "🇵🇹" },
  { code: "RO", name: "Romania", nameAr: "رومانيا", flag: "🇷🇴" },
  { code: "RU", name: "Russia", nameAr: "روسيا", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", nameAr: "رواندا", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts and Nevis", nameAr: "سانت كيتس ونيفيس", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", nameAr: "سانت لوسيا", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", nameAr: "سانت فنسنت والغرينادين", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", nameAr: "ساموا", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", nameAr: "سان مارينو", flag: "🇸🇲" },
  { code: "ST", name: "São Tomé and Príncipe", nameAr: "ساو تومي وبرينسيبي", flag: "🇸🇹" },
  { code: "SN", name: "Senegal", nameAr: "السنغال", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", nameAr: "صربيا", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", nameAr: "سيشل", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", nameAr: "سيراليون", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", nameAr: "سنغافورة", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", nameAr: "سلوفاكيا", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", nameAr: "سلوفينيا", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", nameAr: "جزر سليمان", flag: "🇸🇧" },
  { code: "ZA", name: "South Africa", nameAr: "جنوب أفريقيا", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", nameAr: "جنوب السودان", flag: "🇸🇸" },
  { code: "ES", name: "Spain", nameAr: "إسبانيا", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", nameAr: "سريلانكا", flag: "🇱🇰" },
  { code: "SR", name: "Suriname", nameAr: "سورينام", flag: "🇸🇷" },
  { code: "SE", name: "Sweden", nameAr: "السويد", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", nameAr: "سويسرا", flag: "🇨🇭" },
  { code: "TJ", name: "Tajikistan", nameAr: "طاجيكستان", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", nameAr: "تنزانيا", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", nameAr: "تايلاند", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", nameAr: "تيمور الشرقية", flag: "🇹🇱" },
  { code: "TG", name: "Togo", nameAr: "توغو", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", nameAr: "تونغا", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", nameAr: "ترينيداد وتوباغو", flag: "🇹🇹" },
  { code: "TR", name: "Turkey", nameAr: "تركيا", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", nameAr: "تركمانستان", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", nameAr: "توفالو", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", nameAr: "أوغندا", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", nameAr: "أوكرانيا", flag: "🇺🇦" },
  { code: "GB", name: "United Kingdom", nameAr: "المملكة المتحدة", flag: "🇬🇧" },
  { code: "US", name: "United States", nameAr: "الولايات المتحدة", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", nameAr: "أوروغواي", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", nameAr: "أوزبكستان", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", nameAr: "فانواتو", flag: "🇻🇺" },
  { code: "VA", name: "Vatican City", nameAr: "الفاتيكان", flag: "🇻🇦" },
  { code: "VE", name: "Venezuela", nameAr: "فنزويلا", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", nameAr: "فيتنام", flag: "🇻🇳" },
  { code: "ZM", name: "Zambia", nameAr: "زامبيا", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", nameAr: "زيمبابوي", flag: "🇿🇼" },
];

// ─── Props ──────────────────────────────────────────────────────
interface NationalitySelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
}

// ─── Component ──────────────────────────────────────────────────
const NationalitySelect: React.FC<NationalitySelectProps> = ({
  form,
  name,
  label = "Nationality",
  required = false,
  error,
}) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const getDisplayName = (c: CountryItem) => (isAr ? c.nameAr : c.name);
  const { register, setValue, watch } = form;
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formValue = watch(name);

  const [searchValue, setSearchValue] = useState("");

  // Hydration guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync form value → selected country (e.g. on mount or external changes)
  useEffect(() => {
    if (formValue) {
      const country = COUNTRIES.find(
        (c) => c.name === formValue || c.nameAr === formValue
      );
      if (country && (!selectedCountry || selectedCountry.name !== country.name)) {
        setSelectedCountry(country);
        setSearchValue(getDisplayName(country));
      }
    } else if (!formValue && selectedCountry) {
      setSelectedCountry(null);
      setSearchValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchValue || searchValue.trim().length === 0) {
      return COUNTRIES;
    }
    const q = searchValue.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q)
    );
  }, [searchValue]);

  // Show / hide dropdown
  useEffect(() => {
    if (isFocused) {
      setShowDropdown(true);
    } else {
      const timer = setTimeout(() => setShowDropdown(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: CountryItem) => {
    setSelectedCountry(country);
    const displayName = getDisplayName(country);
    setValue(name, displayName, { shouldValidate: true });
    setSearchValue(displayName);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowDropdown(true);
    if (!value) {
      setValue(name, "", { shouldValidate: true });
      setSelectedCountry(null);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (selectedCountry) {
      setSearchValue(getDisplayName(selectedCountry));
    }
  };

  const hasValue = searchValue && searchValue.length > 0;
  const isActive = isFocused || (isMounted && hasValue);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input for react-hook-form */}
      <input
        type="hidden"
        {...register(name as any, {
          required,
          validate: required
            ? (value) => {
              if (!value || value.trim().length === 0) return "This field is required";
              return true;
            }
            : undefined,
        })}
      />

      <div>
        <div
          className="relative flex items-center px-3 h-16 bg-transparent border border-gray-300 rounded-md transition-all duration-300"
        >
          <label
            htmlFor={name}
            className={`absolute start-3 transition-all font-bold duration-200 pointer-events-none ${isActive ? "top-1 text-gray-500" : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
          >
            {label}
          </label>
          <div className="flex items-center gap-1 relative w-full">
            <input
              autoComplete="off"
              type="search"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={`w-full! font-bold text-black border-none outline-none p-0 ${isActive ? "mt-4" : ""
                }`}
              ref={inputRef}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden flex flex-col">
          {filteredCountries.length === 0 ? (
            <div className="px-4 py-3 flex items-center gap-2">
              <span className="font-semibold text-gray-900">No results found</span>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto max-h-60">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(country)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2 ${selectedCountry?.name === country.name ? "bg-blue-50" : ""
                    }`}
                >
                  <span className="font-semibold text-gray-900">{getDisplayName(country)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          title={error}
          className="absolute -bottom-4 start-4 text-xs text-red-500 font-medium line-clamp-1"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default NationalitySelect;
