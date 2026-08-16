import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ roles = [] }) => {
  const {
    user,
    token,
    initialized,
  } = useSelector((state) => state.auth);

  if (!initialized && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token || !user) {
    return (
      {/*<Navigate
        to="/login"
        replace
      />*/}
    );
  }

  if (
    roles.length > 0 &&
    !roles.includes(user.role)
  ) {
    return (
      {/*<Navigate
        to="/unauthorized"
        replace
      />*/}

    );
  }

  return <Outlet />;
};

export default ProtectedRoute;