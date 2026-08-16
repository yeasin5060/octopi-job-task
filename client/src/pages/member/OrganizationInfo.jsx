import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

const OrganizationInfo = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  const [organization, setOrganization] =
    useState(null);

  useEffect(() => {
    const loadOrganization =
      async () => {
        const { data } =
          await api.get(
            "/api/organization/me"
          );

        setOrganization(
          data.organization
        );
      };

    if (user?.organizationId) {
      loadOrganization();
    }
  }, [user]);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Organization Information
      </h1>

      <div className="max-w-xl bg-white rounded-xl p-6 mt-6">

        <div>
          <p className="text-gray-500">
            Organization
          </p>

          <p className="text-xl font-semibold">
            {organization?.name || "-"}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-gray-500">
            Plan
          </p>

          <p className="text-xl font-semibold">
            {organization?.plan?.name ||
              "-"}
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default OrganizationInfo;