import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPlans,
} from "../../redux/slices/planSlice";

const SelectPlan = ({
  selectedPlan,
  onSelect,
}) => {
  const dispatch = useDispatch();

  const {
    items,
    loading,
  } = useSelector(
    (state) => state.plans
  );

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  if (loading) {
    return <p>Loading plans...</p>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-5">

      {items.map((plan) => (
        <div
          key={plan._id}
          onClick={() =>
            onSelect(plan)
          }
          className={`cursor-pointer border-2 rounded-2xl p-6 ${
            selectedPlan?._id === plan._id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          }`}
        >

          <h3 className="text-xl font-bold">
            {plan.name}
          </h3>

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
  );
};

export default SelectPlan;