import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

// ==========================================
// Get Platform Admin Dashboard Stats
// ==========================================

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",

  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/api/admin/stats"
      );

      return data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load dashboard stats"
      );
    }
  }
);


// ==========================================
// Create Platform Admin
// ==========================================

export const createPlatformAdmin = createAsyncThunk(
  "admin/createPlatformAdmin",

  async (adminData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/api/admin/create",
        adminData
      );

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create platform admin"
      );
    }
  }
);


// ==========================================
// Admin Slice
// ==========================================

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    // Dashboard
    stats: null,

    // Created admins
    admins: [],

    // Dashboard loading
    loading: false,

    // Create admin loading
    creating: false,

    // Dashboard error
    error: null,

    // Create admin error
    createError: null,

    // Create admin success
    createSuccess: false,
  },

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.createError = null;
    },

    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // Fetch Dashboard Stats
      // ======================================

      .addCase(
        fetchDashboardStats.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )

      .addCase(
        fetchDashboardStats.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )


      // ======================================
      // Create Platform Admin
      // ======================================

      .addCase(
        createPlatformAdmin.pending,
        (state) => {
          state.creating = true;
          state.createError = null;
          state.createSuccess = false;
        }
      )

      .addCase(
        createPlatformAdmin.fulfilled,
        (state, action) => {
          state.creating = false;
          state.createError = null;
          state.createSuccess = true;

          state.admins.push(
            action.payload
          );
        }
      )

      .addCase(
        createPlatformAdmin.rejected,
        (state, action) => {
          state.creating = false;
          state.createSuccess = false;
          state.createError = action.payload;
        }
      );
  },
});


// ==========================================
// Actions
// ==========================================

export const {
  clearAdminError,
  clearCreateSuccess,
} = adminSlice.actions;


// ==========================================
// Reducer
// ==========================================

export default adminSlice.reducer;