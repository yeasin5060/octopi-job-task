import DashboardLayout from "../../components/layout/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Organization Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5 mt-8">

        <div className="bg-white p-6 rounded-2xl">
          <p className="text-gray-500">
            Current Plan
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Pro
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <p className="text-gray-500">
            Members
          </p>

          <h2 className="text-2xl font-bold mt-2">
            15 / 20
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <p className="text-gray-500">
            Subscription
          </p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            ACTIVE
          </h2>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;