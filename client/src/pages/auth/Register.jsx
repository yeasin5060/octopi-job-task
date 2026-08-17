import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchPlans } from "../../redux/slices/planSlice";
import { register } from "../../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();

  const {
    items: plans,
    loading: plansLoading,
    error: plansError,
  } = useSelector((state) => state.plans);

  const {
    loading,
    error,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    organizationName: "",
    adminName: "",
    email: "",
    password: "",
    planId: "",
  });

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Plan Select
  // ==========================================

  const handlePlanSelect = (id) => {
    setFormData((prev) => ({
      ...prev,
      planId: id,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.planId) {
      alert("Please select a plan");
      return;
    }

    console.log("REGISTER DATA:", formData);

    const result = await dispatch(
      register(formData)
    );

    console.log("REGISTER RESULT:", result);

    if (register.fulfilled.match(result)) {
      const checkoutUrl =
        result.payload?.checkoutUrl;

      if (!checkoutUrl) {
        console.error(
          "Checkout URL missing:",
          result.payload
        );

        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-10 text-center">

          <h1 className="text-4xl font-bold">
            Create Your Organization
          </h1>

          <p className="mt-2 text-gray-500">
            Choose a plan and start your journey
          </p>

        </div>

        {/* Auth Error */}

        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Plan Error */}

        {plansError && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-red-600">
            {plansError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >

          {/* ====================================== */}
          {/* Organization Information */}
          {/* ====================================== */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* Organization Name */}

            <div>

              <label className="mb-2 block font-medium">
                Organization Name
              </label>

              <input
                type="text"
                name="organizationName"
                value={
                  formData.organizationName
                }
                onChange={handleChange}
                required
                placeholder="Octopi Digital"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

            {/* Admin Name */}

            <div>

              <label className="mb-2 block font-medium">
                Name
              </label>

              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                required
                placeholder="Yeasin Munshi"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
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
                required
                placeholder="admin@example.com"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
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
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

          </div>

          {/* ====================================== */}
          {/* Plans */}
          {/* ====================================== */}

          <div className="mt-10">

            <h2 className="mb-5 text-2xl font-bold">
              Select Your Plan
            </h2>

            {plansLoading ? (

              <div className="py-10 text-center">
                Loading plans...
              </div>

            ) : plans.length === 0 ? (

              <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
                No active plans available.
              </div>

            ) : (

              <div className="grid gap-5 md:grid-cols-3">

                {plans.map((plan) => {

                  const selected =
                    formData.planId ===
                    plan._id;

                  return (
                    <div
                      key={plan._id}
                      onClick={() =>
                        handlePlanSelect(
                          plan._id
                        )
                      }
                      className={`
                        cursor-pointer
                        rounded-2xl
                        border-2
                        p-6
                        transition
                        ${
                          selected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }
                      `}
                    >

                      <h3 className="text-xl font-bold">
                        {plan.name}
                      </h3>

                      {/* Price */}

                      <div className="mt-3">

                        <span className="text-3xl font-bold">
                          ${plan.price}
                        </span>

                        <span className="text-gray-500">
                          /
                          {plan.billingInterval ===
                          "YEARLY"
                            ? "year"
                            : "month"}
                        </span>

                      </div>

                      {/* Features */}

                      <ul className="mt-5 space-y-2">

                        {plan.features?.map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="text-gray-600"
                            >
                              ✓ {feature}
                            </li>
                          )
                        )}

                      </ul>

                      {/* Select */}

                      <div
                        className={`
                          mt-5
                          font-semibold
                          ${
                            selected
                              ? "text-blue-600"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {selected
                          ? "✓ Selected"
                          : "Select Plan"}
                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

          {/* ====================================== */}
          {/* Submit */}
          {/* ====================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              plansLoading ||
              !formData.planId
            }
            className="mt-10 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Checkout..."
              : "Continue to Payment"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Register;