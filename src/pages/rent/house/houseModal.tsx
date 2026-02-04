import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/input/TextArea";
import FileInputExample from "../../../components/form/form-elements/FileInputExample";
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
  attachment:any;
  setAttachment:(val:string) => void;
  houseAddress: string;
  setHouseAddress: (val: string) => void;
  owners: SelectOption[];       
  ownerUuid: string | null;      
  setOwnerUuid: (val: string) => void;
  onSave: () => void;
};

export default function HouseModal({
  isOpen,
  onClose,
  houseName,
  setHouseName,
  message,
  setMessage,
  attachment,
  setAttachment,
  houseAddress,
  setHouseAddress,
  owners,
  ownerUuid,
  setOwnerUuid,
  onSave,
}: HouseModalProps) {

  const handleFileUpload = (uploadedAttachment: any) => {
    setAttachment(uploadedAttachment);
  };




  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Add House
          </h4>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <Label>Housee Name</Label>
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
                onChange={setOwnerUuid}
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
              <div className="col-span-2">
              <FileInputExample onFileUpload={handleFileUpload} />
              </div>
               <div className="col-span-2">
                <Label>House Address</Label>
                <Input
                  type="text"
                  value={houseAddress}
                  onChange={(e) => setHouseAddress(e.target.value)}
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
