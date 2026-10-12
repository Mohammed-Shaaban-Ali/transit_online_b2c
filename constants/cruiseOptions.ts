import type {
  CruisePortOption,
  CruiseRegionOption,
} from "@/types/cruiseTypes";

export const CRUISE_REGION_OPTIONS: CruiseRegionOption[] = [
  { code: "", labelKey: "allRegions" },
  { code: "RED", labelKey: "redSea" },
  { code: "GULF", labelKey: "arabianGulf" },
  { code: "MED", labelKey: "mediterranean" },
  { code: "REPO", labelKey: "worldCruises" },
];

export const CRUISE_PORT_OPTIONS: CruisePortOption[] = [
  { code: "", labelKey: "allPorts" },
  { code: "SAJED", labelKey: "jeddah" },
  { code: "SADMM", labelKey: "dammam" },
  { code: "SADYNB", labelKey: "yanbu" },
  { code: "TRIST", labelKey: "istanbul" },
  { code: "EGALY", labelKey: "alexandria" },
];

export const CRUISE_MONTH_YEARS_AHEAD = 2;
