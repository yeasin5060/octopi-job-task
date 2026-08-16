import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  fetchTransactions,
} from "../../redux/slices/transactionSlice";

const Transactions = () => {
  const dispatch = useDispatch();

  const {
    items,
    loading,
  } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Transactions
      </h1>

      <div className="bg-white rounded-xl overflow-hidden mt-6">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                Transaction
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
            </tr>
          </thead>

          <tbody>

            {items.map((item) => (
              <tr
                key={item._id}
                className="border-t"
              >

                <td className="p-4">
                  {item._id}
                </td>

                <td className="p-4">
                  ${item.amount}
                </td>

                <td className="p-4">
                  {item.status}
                </td>

                <td className="p-4">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
};

export default Transactions;