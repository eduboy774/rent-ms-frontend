import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../../icons";

type SelectOption = {
  label: string;
  value: string;
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;

  firstName: string;
  setFirstName: (val: string) => void;

  lastName: string;
  setLastName: (val: string) => void;

  email: string;
  setEmail: (val: string) => void;

  phone: string;
  setPhone: (val: string) => void;

  profileType: string;
  setProfileType: (val: string) => void;

  profileTitle: string;
  setProfileTitle: (val: string) => void;

  profileGender: string;
  setProfileGender: (val: string) => void;

  password: string;
  setPassword: (val: string) => void;

  onSave: () => void;
};

export default function UserModal({
  isOpen,
  onClose,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  profileType,
  setProfileType,
  profileTitle,
  setProfileTitle,
  profileGender,
  setProfileGender,
  password,
  setPassword,
  onSave,
}: UserModalProps) {
  
  // Options for selects
  const profileTypeOptions: SelectOption[] = [
    { label: "Normal Profile", value: "NORMAL_PROFILE" },
    { label: "Admin Profile", value: "ADMIN_PROFILE" },
  ];

  const profileTitleOptions: SelectOption[] = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Miss", value: "Miss" },
  ];

  const profileGenderOptions: SelectOption[] = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
  ];
  
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          Add User
        </h4>
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            {/* First Name */}
            <div className="col-span-2 lg:col-span-1">
              <Label>First Name</Label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Last Name</Label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Phone</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Profile Type */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Profile Type</Label>
              <Select
                options={profileTypeOptions}
                placeholder="Select Profile Type"
                onChange={setProfileType}
              />
            </div>

            {/* Profile Title */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Profile Title</Label>
              <Select
                options={profileTitleOptions}
                placeholder="Select Title"
                onChange={setProfileTitle}
              />
            </div>

            {/* Gender */}
            <div className="col-span-2 lg:col-span-1">
              <Label>Gender</Label>
              <Select
                options={profileGenderOptions}
                placeholder="Select Gender"
                onChange={setProfileGender}
              />
            </div>

          <div className="col-span-2 lg:col-span-1">
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      onChange={event=>setPassword(event.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 lg:justify-end mt-4">
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
