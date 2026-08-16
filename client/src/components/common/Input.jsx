const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && (
            <span className="text-red-500"> *</span>
          )}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;