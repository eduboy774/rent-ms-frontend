import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";


type SelectOption = {
  label: string;
  value: string;
};

  
  
type RenterModalProps = {
  isOpen: boolean;
  onClose: () => void;

  fullName: string;
  setFullName: (val: string) => void;

  phoneNumber: string ;
  setPhoneNumber: (val: string) => void;

  renterTitle: string;
  setRenterTitle: (val: string) => void;

  nidaNumber: string;
  setNidaNumber: (val: string) => void;

  onSave: () => void;
};

export default function RenterModal({
  isOpen,
  onClose,
  fullName,
  renterTitle,
  setRenterTitle,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  nidaNumber,
  setNidaNumber,
  onSave,
}: RenterModalProps) {

  const profileTitleOptions: SelectOption[] = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
  ];


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Add Renter
          </h4>
        </div>

        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

              {/* Renter Name */}
              <div className="col-span-2">
                <Label>Renter Name</Label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
               {/* Profile Title */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Profile Title</Label>
              <Select
                options={profileTitleOptions}
                placeholder="Select Title"
                onChange={setRenterTitle}
              />
            </div>

              {/* Room Number */}
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  value={phoneNumber ?? ""}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
             

              {/* Capacity */}
              <div>
                <Label>Nida Number</Label>
                <Input
                  type="text"
                  value={nidaNumber ?? ""}
                  onChange={(e) => setNidaNumber(e.target.value)}
                />
              </div>

              
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              Save Room
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
