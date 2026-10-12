import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CruiseRegionCode,
  CruiseSearchFormState,
  CruiseSailingOption,
} from "@/types/cruiseTypes";
import { getDefaultCruiseMonths } from "@/utils/cruiseHelpers";

interface CruiseSearchState {
  form: CruiseSearchFormState;
  submittedForm: CruiseSearchFormState | null;
  results: CruiseSailingOption[];
  isSearchReady: boolean;
  isSearchLoading: boolean;
}

const initialFormState: CruiseSearchFormState = {
  regionPref: "",
  portCode: "",
  selectedMonths: getDefaultCruiseMonths(),
  adults: 2,
  children: 0,
  infants: 0,
};

const initialState: CruiseSearchState = {
  form: initialFormState,
  submittedForm: null,
  results: [],
  isSearchReady: false,
  isSearchLoading: false,
};

const cruiseSearchSlice = createSlice({
  name: "cruiseSearch",
  initialState,
  reducers: {
    setCruiseRegion: (
      state,
      action: PayloadAction<CruiseRegionCode | "">,
    ) => {
      state.form.regionPref = action.payload;
      state.isSearchReady = false;
    },
    setCruisePort: (state, action: PayloadAction<string>) => {
      state.form.portCode = action.payload;
      state.isSearchReady = false;
    },
    setCruiseMonths: (state, action: PayloadAction<string[]>) => {
      state.form.selectedMonths = [...action.payload].sort();
      state.isSearchReady = false;
    },
    toggleCruiseMonth: (state, action: PayloadAction<string>) => {
      const month = action.payload;
      const exists = state.form.selectedMonths.includes(month);
      state.form.selectedMonths = exists
        ? state.form.selectedMonths.filter((value) => value !== month)
        : [...state.form.selectedMonths, month].sort();
      state.isSearchReady = false;
    },
    setCruiseAdults: (state, action: PayloadAction<number>) => {
      state.form.adults = action.payload;
      if (state.form.infants > action.payload) {
        state.form.infants = action.payload;
      }
    },
    setCruiseChildren: (state, action: PayloadAction<number>) => {
      state.form.children = action.payload;
    },
    setCruiseInfants: (state, action: PayloadAction<number>) => {
      state.form.infants = action.payload;
    },
    submitCruiseSearch: (state) => {
      state.submittedForm = {
        ...state.form,
        selectedMonths: [...state.form.selectedMonths],
      };
      state.isSearchReady = true;
    },
    hydrateCruiseSearchForm: (
      state,
      action: PayloadAction<Partial<CruiseSearchFormState>>,
    ) => {
      state.form = {
        ...state.form,
        ...action.payload,
        selectedMonths: action.payload.selectedMonths
          ? [...action.payload.selectedMonths].sort()
          : state.form.selectedMonths,
      };
      state.submittedForm = {
        ...state.form,
        selectedMonths: [...state.form.selectedMonths],
      };
      state.isSearchReady = true;
    },
    patchCruiseSearchForm: (
      state,
      action: PayloadAction<Partial<CruiseSearchFormState>>,
    ) => {
      state.form = {
        ...state.form,
        ...action.payload,
        selectedMonths: action.payload.selectedMonths
          ? [...action.payload.selectedMonths].sort()
          : state.form.selectedMonths,
      };
    },
    setCruiseResults: (state, action: PayloadAction<CruiseSailingOption[]>) => {
      state.results = action.payload;
    },
    clearCruiseResults: (state) => {
      state.results = [];
    },
    resetCruiseSearchForm: (state) => {
      state.form = {
        ...initialFormState,
        selectedMonths: getDefaultCruiseMonths(),
      };
      state.submittedForm = null;
      state.results = [];
      state.isSearchReady = false;
      state.isSearchLoading = false;
    },
    setCruiseSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isSearchLoading = action.payload;
    },
  },
});

export const {
  setCruiseRegion,
  setCruisePort,
  setCruiseMonths,
  toggleCruiseMonth,
  setCruiseAdults,
  setCruiseChildren,
  setCruiseInfants,
  submitCruiseSearch,
  hydrateCruiseSearchForm,
  patchCruiseSearchForm,
  setCruiseResults,
  clearCruiseResults,
  resetCruiseSearchForm,
  setCruiseSearchLoading,
} = cruiseSearchSlice.actions;

export default cruiseSearchSlice;
