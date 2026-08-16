import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

export const fetchSubscription =
  createAsyncThunk(
    "subscription/fetch",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await api.get(
          "/api/subscriptions/current"
        );

        return data.subscription;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load subscription"
        );
      }
    }
  );

export const changeSubscription =
  createAsyncThunk(
    "subscription/change",
    async (planId, { rejectWithValue }) => {
      try {
        const { data } = await api.patch(
          "/api/subscriptions/change",
          { planId }
        );

        return data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to change subscription"
        );
      }
    }
  );

export const cancelSubscription =
  createAsyncThunk(
    "subscription/cancel",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await api.post(
          "/api/subscriptions/cancel"
        );

        return data.subscription;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to cancel subscription"
        );
      }
    }
  );

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState: {
    current: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchSubscription.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchSubscription.fulfilled,
        (state, action) => {
          state.loading = false;
          state.current =
            action.payload;
        }
      )

      .addCase(
        fetchSubscription.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      .addCase(
        changeSubscription.fulfilled,
        (state, action) => {
          state.current =
            action.payload.subscription;
        }
      )

      .addCase(
        cancelSubscription.fulfilled,
        (state, action) => {
          state.current =
            action.payload;
        }
      );
  },
});

export default subscriptionSlice.reducer;