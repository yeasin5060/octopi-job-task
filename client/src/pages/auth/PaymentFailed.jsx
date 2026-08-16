import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">

        <div className="text-6xl">
          ✕
        </div>

        <h1 className="text-3xl font-bold mt-5">
          Payment Failed
        </h1>

        <p className="text-gray-500 mt-3">
          Your payment could not be completed.
          Your organization has not been activated.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Retry Checkout
        </Link>

      </div>

    </div>
  );
};

export default PaymentFailed;