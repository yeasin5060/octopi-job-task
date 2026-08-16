import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

// ==========================================
// Get All Transactions
// PLATFORM ADMIN
// ==========================================

export const fetchTransactions =
  createAsyncThunk(
    "transactions/fetch",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/transactions",
            {
              params,
            }
          );

        return data.transactions || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load transactions"
        );
      }
    }
  );

// ==========================================
// Get My Transactions
// ==========================================

export const fetchMyTransactions =
  createAsyncThunk(
    "transactions/my",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/transactions/my",
            {
              params,
            }
          );

        return data.transactions || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load transactions"
        );
      }
    }
  );

// ==========================================
// Get Total Revenue
// ==========================================

export const fetchTotalRevenue =
  createAsyncThunk(
    "transactions/revenue",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/transactions/revenue",
            {
              params,
            }
          );

        return data.totalRevenue || 0;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to load revenue"
        );
      }
    }
  );

// ==========================================
// Slice
// ==========================================

const transactionSlice =
  createSlice({
    name: "transactions",

    initialState: {
      items: [],

      myItems: [],

      totalRevenue: 0,

      loading: false,

      myLoading: false,

      revenueLoading: false,

      error: null,
    },

    reducers: {
      clearTransactionError: (
        state
      ) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder

        // ==================================
        // ALL TRANSACTIONS
        // ==================================

        .addCase(
          fetchTransactions.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchTransactions.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.items =
              action.payload || [];
          }
        )

        .addCase(
          fetchTransactions.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // ==================================
        // MY TRANSACTIONS
        // ==================================

        .addCase(
          fetchMyTransactions.pending,
          (state) => {
            state.myLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          fetchMyTransactions.fulfilled,
          (
            state,
            action
          ) => {
            state.myLoading =
              false;

            state.myItems =
              action.payload || [];
          }
        )

        .addCase(
          fetchMyTransactions.rejected,
          (
            state,
            action
          ) => {
            state.myLoading =
              false;

            state.error =
              action.payload;
          }
        )

        // ==================================
        // TOTAL REVENUE
        // ==================================

        .addCase(
          fetchTotalRevenue.pending,
          (state) => {
            state.revenueLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          fetchTotalRevenue.fulfilled,
          (
            state,
            action
          ) => {
            state.revenueLoading =
              false;

            state.totalRevenue =
              action.payload || 0;
          }
        )

        .addCase(
          fetchTotalRevenue.rejected,
          (
            state,
            action
          ) => {
            state.revenueLoading =
              false;

            state.error =
              action.payload;
          }
        );
    },
  });

// ==========================================
// Actions
// ==========================================

export const {
  clearTransactionError,
} =
  transactionSlice.actions;

// ==========================================
// Reducer
// ==========================================

export default transactionSlice.reducer;