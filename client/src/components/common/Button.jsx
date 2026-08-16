const Button = ({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger:
      "bg-red-600 hover:bg-red-700 text-white",
    success:
      "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
