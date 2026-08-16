import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

const Billing = () => {
  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { data } =
          await api.get(
            "/payments"
          );

        setPayments(data.payments);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Billing & Payments
      </h1>

      <p className="text-gray-500">
        Your organization's payment history
      </p>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl overflow-hidden mt-6">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  Payment ID
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Invoice
                </th>
              </tr>
            </thead>

            <tbody>

              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t"
                >

                  <td className="p-4">
                    {payment._id}
                  </td>

                  <td className="p-4">
                    ${payment.amount}
                  </td>

                  <td className="p-4">
                    {payment.status}
                  </td>

                  <td className="p-4">
                    {new Date(
                      payment.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button className="text-blue-600">
                      Download
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </DashboardLayout>
  );
};

export default Billing;