import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  fetchOrganizations,
  updateOrganizationStatus,
} from "../../redux/slices/organizationSlice.js";

const Organizations = () => {
  const dispatch = useDispatch();

  const {
    items = [],
    loading,
    error,
    updatingStatus,
  } = useSelector(
    (state) => state.organizations
  );

  const [search, setSearch] = useState("");

  // ==========================================
  // Get All Organizations
  // ==========================================

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // ==========================================
  // Search Organizations
  // ==========================================

  const filteredOrganizations = items.filter(
    (organization) =>
      organization.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      organization.contactEmail
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ==========================================
  // Update Status
  // ==========================================

  const handleStatus = (id, status) => {
    dispatch(
      updateOrganizationStatus({
        id,
        status,
      })
    );
  };

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="mt-1 text-gray-500">
            Manage all organizations
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search organization..."
          className="rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
        />

      </div>

      {/* Error */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <Loader />

      ) : filteredOrganizations.length === 0 ? (

        <EmptyState />

      ) : (

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-4 text-left">
                    Organization
                  </th>

                  <th className="p-4 text-left">
                    Contact Email
                  </th>

                  <th className="p-4 text-left">
                    Type
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Created
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredOrganizations.map(
                  (organization) => (

                    <tr
                      key={organization._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* Name */}

                      <td className="p-4">

                        <p className="font-semibold">
                          {organization.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {organization.billingEmail ||
                            "-"}
                        </p>

                      </td>

                      {/* Contact Email */}

                      <td className="p-4 text-gray-600">
                        {organization.contactEmail ||
                          "-"}
                      </td>

                      {/* Type */}

                      <td className="p-4">

                        {organization.type ===
                        "ADMIN" ? (

                          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                            Admin
                          </span>

                        ) : organization.type ===
                          "MEMBER" ? (

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                            Member
                          </span>

                        ) : (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            -
                          </span>

                        )}

                      </td>

                      {/* Status */}

                      <td className="p-4">

                        {organization.status ===
                        "ACTIVE" ? (

                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            Active
                          </span>

                        ) : organization.status ===
                          "SUSPENDED" ? (

                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                            Suspended
                          </span>

                        ) : (

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            {organization.status ||
                              "-"}
                          </span>

                        )}

                      </td>

                      {/* Created */}

                      <td className="p-4 text-sm text-gray-600">

                        {organization.createdAt
                          ? new Date(
                              organization.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      {/* Action */}

                      <td className="p-4">

                        {organization.status ===
                        "SUSPENDED" ? (

                          <button
                            disabled={updatingStatus}
                            onClick={() =>
                              handleStatus(
                                organization._id,
                                "ACTIVE"
                              )
                            }
                            className="font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            Reactivate
                          </button>

                        ) : (

                          <button
                            disabled={updatingStatus}
                            onClick={() =>
                              handleStatus(
                                organization._id,
                                "SUSPENDED"
                              )
                            }
                            className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            Suspend
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
};

export default Organizations;