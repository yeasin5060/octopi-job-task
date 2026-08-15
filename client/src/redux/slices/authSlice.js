import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../services/api";

// ==========================================
// Login
// ==========================================

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/login",
        credentials
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

// ==========================================
// Get Current User
// ==========================================

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/auth/me"
      );

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Session expired"
      );
    }
  }
);

// ==========================================
// Register
// ==========================================

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/register",
        formData
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

// ==========================================
// Forgot Password
// ==========================================

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/forgot-password",
        { email }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
);

// ==========================================
// Slice
// ==========================================

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(
      localStorage.getItem("user") || "null"
    ),

    token:
      localStorage.getItem("token") || null,

    loading: false,
    initialized: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
      })

      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(
        forgotPassword.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        forgotPassword.fulfilled,
        (state) => {
          state.loading = false;
        }
      )

      .addCase(
        forgotPassword.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;