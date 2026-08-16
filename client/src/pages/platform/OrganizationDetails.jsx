import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import {
  fetchOrganization,
} from "../../redux/slices/organizationSlice";

const OrganizationDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    current,
  } = useSelector(
    (state) => state.organizations
  );

  useEffect(() => {
    dispatch(fetchOrganization(id));
  }, [dispatch, id]);

  if (!current) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Organization Details
      </h1>

      <div className="bg-white rounded-xl p-6">

        <h2 className="text-2xl font-bold">
          {current.name}
        </h2>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <div>
            <p className="text-gray-500">
              Status
            </p>
            <p className="font-semibold">
              {current.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Billing Email
            </p>
            <p className="font-semibold">
              {current.billingEmail || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Created
            </p>
            <p className="font-semibold">
              {new Date(
                current.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Members
            </p>
            <p className="font-semibold">
              {current.memberCount || 0}
            </p>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default OrganizationDetails;