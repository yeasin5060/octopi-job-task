import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">

      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">

        <div className="text-6xl">
          ✓
        </div>

        <h1 className="text-3xl font-bold mt-5">
          Payment Submitted
        </h1>

        <p className="text-gray-500 mt-3">
          Your payment was submitted successfully.
          Organization activation will be completed
          after server-side Stripe webhook verification.
        </p>

        <Link
          to="/login"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Continue to Login
        </Link>

      </div>

    </div>
  );
};

export default PaymentSuccess;