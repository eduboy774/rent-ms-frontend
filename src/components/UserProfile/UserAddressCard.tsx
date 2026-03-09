import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    closeModal();
  };

  const fields = [
    { label: "Country", value: "Tanzania" },
    { label: "City", value: "Dodoma" },
    { label: "Area", value: "Chimwaga" },
    { label: "Postal Code", value: "2489" },
    { label: "TAX ID", value: "AS4568384" },
  ];

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 lg:px-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Address
          </h4>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 lg:p-6">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{f.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="w-full rounded-2xl bg-white p-5 dark:bg-gray-900 lg:p-7">
          <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Edit Address
          </h4>
          <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
            Update your address information.
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Country</Label>
                <Input type="text" defaultValue="Tanzania" />
              </div>
              <div>
                <Label>City</Label>
                <Input type="text" defaultValue="Dodoma" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Area</Label>
                <Input type="text" defaultValue="Chimwaga" />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input type="text" defaultValue="2489" />
              </div>
            </div>
            <div>
              <Label>TAX ID</Label>
              <Input type="text" defaultValue="AS4568384" />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
