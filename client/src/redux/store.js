import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import planReducer from "./slices/planSlice";
import organizationReducer from "./slices/organizationSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import transactionReducer from "./slices/transactionSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    plans: planReducer,
    organizations: organizationReducer,
    subscription: subscriptionReducer,
    transactions: transactionReducer,
  },
});