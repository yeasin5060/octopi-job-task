const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display.",
}) => {
  return (
    <div className="bg-white rounded-xl p-10 text-center">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-gray-500 mt-2">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;