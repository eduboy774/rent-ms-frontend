type ConfirmToastProps = {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
};

export default function ConfirmToast({ onConfirm, onCancel, message }: ConfirmToastProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-800">
        {message || "Are you sure you want to delete?"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-600"
        >
          Yes, confirm
        </button>
        <button
          onClick={onCancel}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
