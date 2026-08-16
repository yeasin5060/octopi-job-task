import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

// ==================================================
// Fetch All Organizations
// PLATFORM ADMIN
// ==================================================
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/api/organization",
        {
          params,
        }
      );

      console.log("Organizations API Response:", data);

      return data.organizations;
    } catch (error) {
      console.error(
        "Organizations API Error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load organizations"
      );
    }
  }
);

// ==================================================
// Fetch Single Organization
// PLATFORM ADMIN
// ==================================================

export const fetchOrganization = createAsyncThunk(
  "organizations/fetchOne",

  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/organizations/${id}`
      );

      return data.organization;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Organization not found"
      );
    }
  }
);

// ==================================================
// Create Admin Organization
// ==================================================

export const createAdminOrganization =
  createAsyncThunk(
    "organizations/createAdmin",

    async (organizationData, { rejectWithValue }) => {
      try {
        const { data } = await api.post(
          "/api/organization/admin",
          organizationData
        );

        return data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create admin organization"
        );
      }
    }
  );

// ==================================================
// Update Organization Status
// PLATFORM ADMIN
// ==================================================

export const updateOrganizationStatus =
  createAsyncThunk(
    "organizations/status",

    async (
      { id, status },
      { rejectWithValue }
    ) => {
      try {
        const { data } = await api.patch(
          `/api/organizations/${id}/status`,
          {
            status,
          }
        );

        return data.organization;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update status"
        );
      }
    }
  );

// ==================================================
// Update Organization
// ORG ADMIN
// ==================================================

export const updateOrganization =
  createAsyncThunk(
    "organizations/update",

    async (
      { id, data: body },
      { rejectWithValue }
    ) => {
      try {
        const { data } = await api.patch(
          `/api/organizations/${id}`,
          body
        );

        return data.organization;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update organization"
        );
      }
    }
  );

// ==================================================
// Get Organization Subscription
// ORG ADMIN
// ==================================================

export const fetchOrganizationSubscription =
  createAsyncThunk(
    "organizations/subscription",

    async (_, { rejectWithValue }) => {
      try {
        const { data } = await api.get(
          "/api/organization/subscription"
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

// ==================================================
// Slice
// ==================================================

const organizationSlice = createSlice({
  name: "organizations",

  initialState: {
    // All organizations
    items: [],

    // Single organization
    current: null,

    // Organization subscription
    subscription: null,

    // Loading
    loading: false,

    // Create Admin Organization loading
    creating: false,

    // Update loading
    updating: false,

    // Status loading
    updatingStatus: false,

    // Subscription loading
    subscriptionLoading: false,

    // Errors
    error: null,

    createError: null,

    updateError: null,

    statusError: null,

    subscriptionError: null,

    // Success
    createSuccess: false,
  },

  reducers: {
    clearOrganizationError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.statusError = null;
      state.subscriptionError = null;
    },

    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },

    clearCurrentOrganization: (state) => {
      state.current = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // FETCH ALL ORGANIZATIONS
      // ==================================================

      .addCase(
        fetchOrganizations.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrganizations.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload || [];
        }
      )

      .addCase(
        fetchOrganizations.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      )

      // ==================================================
      // FETCH SINGLE ORGANIZATION
      // ==================================================

      .addCase(
        fetchOrganization.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOrganization.fulfilled,
        (state, action) => {
          state.loading = false;

          state.current =
            action.payload;
        }
      )

      .addCase(
        fetchOrganization.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      )

      // ==================================================
      // CREATE ADMIN ORGANIZATION
      // ==================================================

      .addCase(
        createAdminOrganization.pending,
        (state) => {
          state.creating = true;

          state.createError = null;

          state.createSuccess = false;
        }
      )

      .addCase(
        createAdminOrganization.fulfilled,
        (state, action) => {
          state.creating = false;

          state.createError = null;

          state.createSuccess = true;

          // Backend returns:
          // {
          //   organization,
          //   user
          // }

          const organization =
            action.payload.organization;

          state.current =
            organization;

          // Prevent duplicate
          const exists =
            state.items.some(
              (item) =>
                item._id ===
                organization._id
            );

          if (!exists) {
            state.items.push(
              organization
            );
          }
        }
      )

      .addCase(
        createAdminOrganization.rejected,
        (state, action) => {
          state.creating = false;

          state.createSuccess = false;

          state.createError =
            action.payload;
        }
      )

      // ==================================================
      // UPDATE ORGANIZATION STATUS
      // ==================================================

      .addCase(
        updateOrganizationStatus.pending,
        (state) => {
          state.updatingStatus = true;

          state.statusError = null;
        }
      )

      .addCase(
        updateOrganizationStatus.fulfilled,
        (state, action) => {
          state.updatingStatus = false;

          const updated =
            action.payload;

          const index =
            state.items.findIndex(
              (item) =>
                item._id ===
                updated._id
            );

          if (index !== -1) {
            state.items[index] =
              updated;
          }

          if (
            state.current?._id ===
            updated._id
          ) {
            state.current =
              updated;
          }
        }
      )

      .addCase(
        updateOrganizationStatus.rejected,
        (state, action) => {
          state.updatingStatus = false;

          state.statusError =
            action.payload;
        }
      )

      // ==================================================
      // UPDATE ORGANIZATION
      // ==================================================

      .addCase(
        updateOrganization.pending,
        (state) => {
          state.updating = true;

          state.updateError = null;
        }
      )

      .addCase(
        updateOrganization.fulfilled,
        (state, action) => {
          state.updating = false;

          state.current =
            action.payload;

          const index =
            state.items.findIndex(
              (item) =>
                item._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.items[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateOrganization.rejected,
        (state, action) => {
          state.updating = false;

          state.updateError =
            action.payload;
        }
      )

      // ==================================================
      // FETCH SUBSCRIPTION
      // ==================================================

      .addCase(
        fetchOrganizationSubscription.pending,
        (state) => {
          state.subscriptionLoading =
            true;

          state.subscriptionError =
            null;
        }
      )

      .addCase(
        fetchOrganizationSubscription.fulfilled,
        (state, action) => {
          state.subscriptionLoading =
            false;

          state.subscription =
            action.payload;
        }
      )

      .addCase(
        fetchOrganizationSubscription.rejected,
        (state, action) => {
          state.subscriptionLoading =
            false;

          state.subscriptionError =
            action.payload;
        }
      );
  },
});

// ==================================================
// Actions
// ==================================================

export const {
  clearOrganizationError,
  clearCreateSuccess,
  clearCurrentOrganization,
} = organizationSlice.actions;

// ==================================================
// Reducer
// ==================================================

export default organizationSlice.reducer;