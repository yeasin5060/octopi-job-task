import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import api from "../../services/api";

const ResetPassword = () => {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match"
      );

      return;
    }

    try {
      await api.post(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      navigate("/login");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Password reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold">
          Reset Password
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-6"
        >

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
            className="w-full border rounded-lg p-3"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
};

export default ResetPassword;