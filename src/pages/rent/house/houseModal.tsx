import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";

type SelectOption = {
  label: string;
  value: string;
};

type HouseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  houseName: string;
  setHouseName: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  owners: SelectOption[];
  ownerUuid: string | null;
  setOwnerUuid: (val: string) => void;
  regions: SelectOption[];
  regionUuid: string | null;
  setRegionUuid: (val: string) => void;
  districts: SelectOption[];
  districtUuid: string | null;
  setDistrictUuid: (val: string) => void;
  councils: SelectOption[];
  councilUuid: string | null;
  setCouncilUuid: (val: string) => void;
  wards: SelectOption[];
  wardUuid: string | null;
  setWardUuid: (val: string) => void;
  onSave: () => void;
  isEditing?: boolean;
};

export default function HouseModal({
  isOpen,
  onClose,
  houseName,
  setHouseName,
  message,
  setMessage,
  owners,
  ownerUuid,
  setOwnerUuid,
  regions,
  regionUuid,
  setRegionUuid,
  districts,
  districtUuid,
  setDistrictUuid,
  councils,
  councilUuid,
  setCouncilUuid,
  wards,
  wardUuid,
  setWardUuid,
  onSave,
  isEditing = false,
}: HouseModalProps) {
  // Each level unlocks only once its parent is chosen, so the user cannot pick a
  // ward that belongs to a different council than the one selected above it.
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            {isEditing ? "Edit House" : "Add House"}
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <Label>House Name</Label>
                <Input
                  type="text"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Select Owner</Label>
                <Select
                  options={owners}
                  placeholder="Select Owner"
                  value={ownerUuid ?? ""}
                  onChange={setOwnerUuid}
                />
              </div>

              <div className="col-span-2">
                <h5 className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Location
                </h5>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Region</Label>
                <Select
                  options={regions}
                  placeholder="Select Region"
                  value={regionUuid ?? ""}
                  onChange={setRegionUuid}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>District</Label>
                <Select
                  key={`district-${regionUuid ?? "none"}`}
                  options={districts}
                  placeholder={regionUuid ? "Select District" : "Select a region first"}
                  value={districtUuid ?? ""}
                  onChange={setDistrictUuid}
                  className={!regionUuid ? "cursor-not-allowed opacity-60" : ""}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Council</Label>
                <Select
                  key={`council-${districtUuid ?? "none"}`}
                  options={councils}
                  placeholder={districtUuid ? "Select Council" : "Select a district first"}
                  value={councilUuid ?? ""}
                  onChange={setCouncilUuid}
                  className={!districtUuid ? "cursor-not-allowed opacity-60" : ""}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label>Ward</Label>
                <Select
                  key={`ward-${councilUuid ?? "none"}`}
                  options={wards}
                  placeholder={councilUuid ? "Select Ward" : "Select a council first"}
                  value={wardUuid ?? ""}
                  onChange={setWardUuid}
                  className={!councilUuid ? "cursor-not-allowed opacity-60" : ""}
                />
              </div>

              <div className="col-span-2">
                <Label>House Description</Label>
                <TextArea
                  value={message}
                  onChange={(val) => setMessage(val)}
                  rows={2}
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
