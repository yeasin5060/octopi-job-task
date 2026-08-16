import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createPlatformAdmin,
} from "../../redux/slices/adminSlice";

const CreatePlatformAdmin = () => {
  const dispatch = useDispatch();

  const {
    creating,
    createError,
    createSuccess,
  } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("FORM SUBMIT");

  const result = await dispatch(
    createPlatformAdmin(formData)
  );

  console.log("API RESULT:", result);

  if (createPlatformAdmin.fulfilled.match(result)) {
    console.log("ADMIN CREATED");
    
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }
};

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">
        Create Platform Admin
      </h1>

      <p className="mt-1 text-gray-500">
        Create a new platform administrator
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        {/* Name */}
        <div>
          <label className="mb-2 block font-medium">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Admin name"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            minLength={6}
            required
          />
        </div>

        {/* Error */}
        {createError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {createError}
          </div>
        )}

        {/* Success */}
        {createSuccess && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            Platform Admin created successfully!
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={creating}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating
            ? "Creating..."
            : "Create Platform Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlatformAdmin;