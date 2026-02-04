type ConfirmToastProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmToast({ onConfirm, onCancel }: ConfirmToastProps) {
  return (
    <div>
      <p className="font-medium text-gray-800">Are you sure you want to delete?</p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="rounded bg-gray-300 px-3 py-1 text-gray-800 hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  );
}
