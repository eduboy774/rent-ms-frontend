import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

type SelectOption = {
  label: string;
  value: string;
};

type RoomModalProps = {
  isOpen: boolean;
  onClose: () => void;

  name: string;
  setName: (val: string) => void;

  number: number | null;
  setNumber: (val: number | null) => void;

  capacity: number | null;
  setCapacity: (val: number | null) => void;

  pricePerNight: number | null;
  setPricePerNight: (val: number | null) => void;

  houses: SelectOption[];
  houseUuid: string | null;
  setHouseUuid: (val: string) => void;

  onSave: () => void;
};

export default function RoomModal({
  isOpen,
  onClose,
  name,
  setName,
  number,
  setNumber,
  capacity,
  setCapacity,
  pricePerNight,
  setPricePerNight,
  houses,
  houseUuid,
  setHouseUuid,
  onSave,
}: RoomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Add Room
          </h4>
        </div>

        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

              {/* Room Name */}
              <div className="col-span-2">
                <Label>Room Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Room Number */}
              <div>
                <Label>Room Number</Label>
                <Input
                  type="number"
                  value={number ?? ""}
                  onChange={(e) => setNumber(e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              {/* Capacity */}
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={capacity ?? ""}
                  onChange={(e) =>
                    setCapacity(e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>

              {/* Price */}
              <div>
                <Label>Price Per Night</Label>
                <Input
                  type="number"
                  value={pricePerNight ?? ""}
                  onChange={(e) =>
                    setPricePerNight(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
              </div>

              {/* House */}
              <div>
                <Label>House</Label>
                <Select
                  options={houses}
                  placeholder="Select House"
                  onChange={setHouseUuid}
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
