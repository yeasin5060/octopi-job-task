import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import planReducer from "./slices/planSlice";
import organizationReducer from "./slices/organizationSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: planReducer,
    organizations: organizationReducer,
    subscription: subscriptionReducer,
    transactions: transactionReducer,
  },
});