import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

type SelectOption = {
  label: string;
  value: string;
};

type HouseRentalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  houseName: string;
  setHouseName: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  owners: SelectOption[];     
  renters: SelectOption[];
  houses:SelectOption [];
  renterUuid: string | null;
  ownerUuid: string | null;
  houseUuid:string | null;
  setHouseUuid:(val:string) => void;
  setRenterUuid: (val: string) => void;  
  setOwnerUuid: (val: string) => void;
  onSave: () => void;
};


export default function HouseRentalModal({
  isOpen,
  onClose,
  houseName,
  setHouseName,
  message,
  setMessage,
  owners,
  ownerUuid,
  setOwnerUuid,
  renters,
  houses,
  renterUuid,
  setRenterUuid,
  setHouseUuid,
  houseUuid,
  onSave,
}: HouseRentalModalProps) {




  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Add House Rental Information
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              
              <div className="col-span-2">
                <Label>Select Owner</Label>
              <Select
                options={owners}
                placeholder="Select Owner"
                onChange={setOwnerUuid}
              />
              </div>

              <div className="col-span-2">
                <Label>Select Renter</Label>
              <Select
                options={renters}
                placeholder="Select Renter"
                onChange={setRenterUuid}
              />
              </div>
               <div className="col-span-2">
                <Label>Select House</Label>
              <Select
                options={houses}
                placeholder="Select Renter"
                onChange={setHouseUuid}
              />
              </div>
              
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-500"
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
