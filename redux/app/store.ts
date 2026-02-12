import { configureStore } from "@reduxjs/toolkit";
import { baseApi, baseApi2 } from "./baseApi";
import hotelFilterSlice from "../features/hotels/hotelFilterSlice";
import flightFilterSlice from "../features/flights/flightFilterSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [baseApi2.reducerPath]: baseApi2.reducer,
    hotelFilter: hotelFilterSlice.reducer,
    flightFilter: flightFilterSlice.reducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(baseApi.middleware, baseApi2.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
