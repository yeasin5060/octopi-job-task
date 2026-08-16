import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  forgotPassword,
} from "../../redux/slices/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      forgotPassword(email)
    );

    if (
      forgotPassword.fulfilled.match(
        result
      )
    ) {
      setMessage(
        result.payload.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <p className="text-gray-500 mt-2">
          Enter your email to receive a reset link.
        </p>

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mt-5">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email address"
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;