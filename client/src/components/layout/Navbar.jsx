import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <h2 className="font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">

        <div className="text-right">
          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role}
          </p>
        </div>

        <button
          onClick={() =>
            dispatch(logout())
          }
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;