import DashboardLayout from "../../components/layout/DashboardLayout";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <div className="bg-white rounded-2xl p-6 mt-8">

        <h2 className="text-xl font-bold">
          Organization Information
        </h2>

        <div className="mt-5">
          <p className="text-gray-500">
            Organization
          </p>

          <p className="font-semibold">
            Your Organization
          </p>
        </div>

        <div className="mt-5">
          <p className="text-gray-500">
            Plan
          </p>

          <p className="font-semibold">
            Pro
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;