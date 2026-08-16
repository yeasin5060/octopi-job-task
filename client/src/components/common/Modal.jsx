const Modal = ({
  open,
  onClose,
  title,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">

        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;