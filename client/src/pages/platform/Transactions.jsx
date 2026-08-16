import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import {
  fetchTransactions,
} from "../../redux/slices/transactionSlice";

const Transactions = () => {
  const dispatch = useDispatch();

  const {
    items = [],
    loading,
    error,
  } = useSelector(
    (state) => state.transactions
  );

  // ==========================================
  // Fetch Transactions
  // ==========================================

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        <p className="mt-1 text-gray-500">
          Platform-wide transactions
        </p>
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

      ) : items.length === 0 ? (

        <EmptyState />

      ) : (

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Organization
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((transaction) => (

                  <tr
                    key={transaction._id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* Organization */}

                    <td className="p-4">

                      <p className="font-medium text-gray-900">
                        {transaction.organization?.name ||
                          transaction.organizationId?.name ||
                          "-"}
                      </p>

                    </td>

                    {/* Amount */}

                    <td className="p-4 font-medium">
                      ${Number(
                        transaction.amount || 0
                      ).toFixed(2)}
                    </td>

                    {/* Status */}

                    <td className="p-4">

                      {transaction.status ===
                      "SUCCESS" ? (

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                          Success
                        </span>

                      ) : transaction.status ===
                        "PENDING" ? (

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                          Pending
                        </span>

                      ) : transaction.status ===
                        "FAILED" ? (

                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                          Failed
                        </span>

                      ) : (

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                          {transaction.status ||
                            "-"}
                        </span>

                      )}

                    </td>

                    {/* Date */}

                    <td className="p-4 text-sm text-gray-600">

                      {transaction.createdAt
                        ? new Date(
                            transaction.createdAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
};

export default Transactions;