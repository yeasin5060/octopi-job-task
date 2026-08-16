import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  const role = user?.role;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-10">
        Octopi
      </h1>

      <nav className="space-y-2">

        {role === "PLATFORM_ADMIN" && (
          <>
            <Link
              to="/admin/dashboard"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/organizations"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Organizations
            </Link>

            <Link
              to="/admin/plans"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Plans
            </Link>

            <Link
              to="/admin/transactions"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Transactions
            </Link>
          </>
        )}

        {role === "ORG_ADMIN" && (
          <>
            <Link
              to="/organization/dashboard"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              to="/organization/members"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Members
            </Link>
            <Link
              to="/organization/create"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Organization Create
            </Link>

            <Link
              to="/organization/subscription"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Subscription
            </Link>

            <Link
              to="/organization/billing"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Billing
            </Link>

            <Link
              to="/organization/transactions"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Transactions
            </Link>
          </>
        )}

        {role === "MEMBER" && (
          <>
            <Link
              to="/member/dashboard"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Dashboard
            </Link>

            <Link
              to="/member/profile"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              My Profile
            </Link>

            <Link
              to="/member/organization"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Organization
            </Link>
          </>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;