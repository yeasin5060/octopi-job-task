import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  fetchDashboardStats,
} from "../../redux/slices/adminSlice";

import {
  fetchTotalRevenue,
} from "../../redux/slices/transactionSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  // ==========================================
  // Admin Stats
  // ==========================================

  const {
    stats,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  // ==========================================
  // Transaction / Revenue
  // ==========================================

  const {
    totalRevenue,
    revenueLoading,
    error: revenueError,
  } = useSelector(
    (state) => state.transactions
  );

  // ==========================================
  // Fetch Dashboard Stats
  // ==========================================

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // ==========================================
  // Fetch Total Revenue
  // ==========================================

  useEffect(() => {
    dispatch(fetchTotalRevenue());
  }, [dispatch]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="p-6">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Dashboard Error
  // ==========================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Render
  // ==========================================

  return (
    <DashboardLayout>

      <div>

        {/* Header */}

        <h1 className="text-3xl font-bold">
          Platform Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Overview of your SaaS platform
        </p>

        {/* Revenue Error */}

        {revenueError && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
            {revenueError}
          </div>
        )}

        {/* =====================================
            Stats Cards
        ====================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-4">

          {/* Organizations */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-gray-500">
              Organizations
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {stats?.totalOrganizations ?? 0}
            </h2>

          </div>

          {/* Users */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-gray-500">
              Total Users
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {stats?.totalUsers ?? 0}
            </h2>

          </div>

          {/* Subscriptions */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-gray-500">
              Active Subscriptions
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {stats?.activeSubscriptions ?? 0}
            </h2>

          </div>

          {/* =================================
              Total Revenue
          ================================== */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-gray-500">
              Total Revenue
            </p>

            {revenueLoading ? (

              <p className="mt-2 text-lg text-gray-400">
                Loading...
              </p>

            ) : (

              <h2 className="mt-2 text-3xl font-bold">
                $
                {Number(
                  totalRevenue || 0
                ).toLocaleString()}
              </h2>

            )}

            <p className="mt-1 text-sm text-gray-400">
              Successful payments
            </p>

          </div>

          {/* Failed Payments */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-gray-500">
              Failed Payments
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {stats?.failedPayments ?? 0}
            </h2>

          </div>

        </div>

        {/* =====================================
            Recent Organizations
        ====================================== */}

        <div className="mt-8 rounded-2xl bg-white p-6">

          <h2 className="text-xl font-bold">
            Recent Organizations
          </h2>

          {stats?.recentSignups?.length > 0 ? (

            <div className="mt-5 space-y-3">

              {stats.recentSignups.map(
                (org) => (

                  <div
                    key={org._id}
                    className="flex justify-between border-b pb-3"
                  >

                    <span className="font-medium">
                      {org.name}
                    </span>

                    <span className="text-gray-500">
                      {org.status}
                    </span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="mt-5 text-gray-500">
              No organizations found.
            </p>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;