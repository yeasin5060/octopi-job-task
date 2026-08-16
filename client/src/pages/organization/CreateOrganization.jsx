import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createAdminOrganization,
} from "../../redux/slices/organizationSlice.js";

const CreateOrganization = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    creating,
    createError,
    createSuccess,
  } = useSelector(
    (state) => state.organizations
  );

  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    billingEmail: "",
  });

  // ==========================================
  // Handle Change
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createOrganization(formData)
    );

    console.log(
      "CREATE ORGANIZATION RESULT:",
      result
    );

    if (
      createOrganization.fulfilled.match(result)
    ) {
      navigate(
        "/organization/dashboard"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-xl">

        {/* Header */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold">
            Create Organization
          </h1>

          <p className="text-gray-500 mt-2">
            Create your organization
          </p>

        </div>

        {/* Card */}

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Error */}

          {createError && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
              {createError}
            </div>
          )}

          {/* Success */}

          {createSuccess && (
            <div className="mb-5 rounded-lg bg-green-50 p-4 text-green-600">
              Organization created successfully!
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Organization Name */}

            <div>

              <label className="block mb-2 font-medium">
                Organization Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Octopi Digital"
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            {/* Contact Email */}

            <div>

              <label className="block mb-2 font-medium">
                Contact Email
              </label>

              <input
                type="email"
                name="contactEmail"
                value={
                  formData.contactEmail
                }
                onChange={handleChange}
                placeholder="contact@example.com"
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            {/* Billing Email */}

            <div>

              <label className="block mb-2 font-medium">
                Billing Email
              </label>

              <input
                type="email"
                name="billingEmail"
                value={
                  formData.billingEmail
                }
                onChange={handleChange}
                placeholder="billing@example.com"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Organization"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default CreateOrganization;