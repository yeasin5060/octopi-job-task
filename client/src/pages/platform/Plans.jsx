import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import {
  fetchPlans,
  createPlan,
} from "../../redux/slices/planSlice";

const Plans = () => {
  const dispatch = useDispatch();

  const {
    items,
    loading,
  } = useSelector(
    (state) => state.plans
  );

  const [open, setOpen] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      billingInterval: "MONTHLY",
      features: "",
    });

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createPlan({
        name: form.name,
        price: Number(form.price),
        billingInterval:
          form.billingInterval,
        features:
          form.features
            .split(",")
            .map((item) => item.trim()),
      })
    );

    if (createPlan.fulfilled.match(result)) {
      setOpen(false);

      setForm({
        name: "",
        price: "",
        billingInterval: "MONTHLY",
        features: "",
      });
    }
  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Plans
          </h1>

          <p className="text-gray-500">
            Manage subscription plans
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
        >
          Create Plan
        </Button>

      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {items.map((plan) => (
          <div
            key={plan._id}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >

            <h2 className="text-xl font-bold">
              {plan.name}
            </h2>

            <p className="text-3xl font-bold mt-3">
              ${plan.price}
            </p>

            <p className="text-gray-500">
              {plan.billingInterval}
            </p>

            <ul className="mt-5 space-y-2">
              {plan.features?.map(
                (feature, index) => (
                  <li key={index}>
                    ✓ {feature}
                  </li>
                )
              )}
            </ul>

          </div>
        ))}

      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Plan"
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            placeholder="Plan name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            value={form.billingInterval}
            onChange={(e) =>
              setForm({
                ...form,
                billingInterval:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="MONTHLY">
              Monthly
            </option>

            <option value="YEARLY">
              Yearly
            </option>
          </select>

          <textarea
            placeholder="Feature 1, Feature 2, Feature 3"
            value={form.features}
            onChange={(e) =>
              setForm({
                ...form,
                features: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Plan
          </Button>

        </form>

      </Modal>

    </DashboardLayout>
  );
};

export default Plans;