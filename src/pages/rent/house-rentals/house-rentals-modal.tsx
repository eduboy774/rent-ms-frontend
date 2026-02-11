import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";

type SelectOption = {
  label: string;
  value: string;
};

 const statusOptions: SelectOption[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Terminated", value: "TERMINATED" },
];

const durationOptions: SelectOption[] = [
  { label: "Three Months", value: "3" },
  { label: "Six Months", value: "6" },
  { label: "One Year", value: "12" },
];



type HouseRentalModalProps = {
  isOpen: boolean;
  autoRenew:boolean;
  onClose: () => void;
  amount: number | null;
  setAmount: (val: number | null) => void;
  noticePeriodDays:number | null;
  setNoticePeriodDays: (val: number | null) => void;
  status: string;
  duration:string;
  setDuration:(val:string) => void;
  setStatus: (val: string) => void;
  owners: SelectOption[];     
  renters: SelectOption[];
  houses:SelectOption [];
  renterUuid: string | null;
  houseUuid:string | null;
  setAutoRenew:(val:boolean) => void;
  setHouseUuid:(val:string) => void;
  setRenterUuid: (val: string) => void;  
  onSave: () => void;
};


export default function HouseRentalModal({
  isOpen,
  onClose,
  amount,
  setAmount,
  status,
  autoRenew,
  setAutoRenew,
  duration,
  setDuration,
  setStatus,
  owners,
  renters,
  houses,
  renterUuid,
  setRenterUuid,
  noticePeriodDays,
  setNoticePeriodDays,
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
              <div className="col-span-2 lg:col-span-1">
                <Label>Select Renter</Label>
              <Select
                options={renters}
                placeholder="Select Renter"
                onChange={setRenterUuid}
              />
              </div>
               <div className="col-span-2 lg:col-span-1">
                <Label>Select House</Label>
              <Select
                options={houses}
                placeholder="Select House"
                onChange={setHouseUuid}
              />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount ?? ""}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
               <div className="col-span-2 lg:col-span-1">
              <Label>Status</Label>
              <Select
                options={statusOptions}
                placeholder="Select Status"
                onChange={setStatus}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Durations</Label>
              <Select
                options={durationOptions}
                placeholder="Select Duration"
                onChange={setDuration}
              />
            </div>
  
            <div className="col-span-2 lg:col-span-1">
                <Label>Notice Period</Label>
                <Input
                  type="noticePeriodDays"
                  placeholder="Notice Period"
                  value={noticePeriodDays ?? ""}
                  onChange={(e) => setNoticePeriodDays(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              <div className="col-span-2 lg:col-span-1 mt-5">
            <Checkbox
            checked={autoRenew}
            onChange={setAutoRenew}
            label="Auto Renew"
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
