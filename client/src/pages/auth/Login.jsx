import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await dispatch(login(formData));

  console.log("LOGIN RESULT:", result);

  if (login.fulfilled.match(result)) {
    const { token, user } = result.payload;

    console.log("TOKEN:", token);
    console.log("USER:", user);

    // Save authentication
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect
    switch (user.role) {
      case "PLATFORM_ADMIN":
        navigate("/admin/dashboard", {
          replace: true,
        });
        break;

      case "ORG_ADMIN":
        navigate("/organization/dashboard", {
          replace: true,
        });
        break;

      case "MEMBER":
        navigate("/member/dashboard", {
          replace: true,
        });
        break;

      default:
        navigate("/login", {
          replace: true,
        });
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center">
          Octopi Digital
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Sign in to your account
        </p>

        {error && (
          <div className="mt-5 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-6"
        >
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-blue-600 text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;