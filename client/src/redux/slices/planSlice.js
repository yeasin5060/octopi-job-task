import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

// Get active plans
export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/plans");

      return data.plans;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load plans"
      );
    }
  }
);

// Admin create plan
export const createPlan = createAsyncThunk(
  "plans/createPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/plans",
        planData
      );

      return data.plan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create plan"
      );
    }
  }
);

const planSlice = createSlice({
  name: "plans",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchPlans.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchPlans.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(createPlan.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default planSlice.reducer;