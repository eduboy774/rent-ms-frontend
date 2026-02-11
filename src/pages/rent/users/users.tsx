
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Audio, BallTriangle } from "react-loader-spinner";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import UserModal from "./userModal";

import {
  User,
  UserInputObject,
  UserFilteringInputObject,
  CreateUserMutation,
  CreateUserVars,
} from "../../../types/users";
import { ACTIVATE_OR_DEACTIVATE_USER, CREATE_USER } from "../../../graphql/mutation";
import UserTable from "./UserTable";

export default function UserPage() {
  const { isOpen, openModal, closeModal } = useModal();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileType, setProfileType] = useState("NORMAL_PROFILE");
  const [profileTitle, setProfileTitle] = useState("Mr");
  const [profileGender, setProfileGender] = useState("MALE");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState<User[]>([]);

  const { success, error, info } = useToast();

  // GraphQL mutations
  const [createUser] = useMutation<CreateUserMutation, CreateUserVars>(CREATE_USER);
  const [toggleUser] = useMutation(ACTIVATE_OR_DEACTIVATE_USER);

  // Default user filter
  const defaultUserFilter: UserFilteringInputObject = {
    profileType: null,
    profileIsActive: true,
    pageNumber: 1,
  };

  // Fetch users
  const { loading, error: queryError } = useQuery(GET_USERS, {
    variables: { filtering: defaultUserFilter },
    onCompleted: (data) => {
      setUsers(data?.getUsers?.data || []);
    },
  });

  // Delete / Deactivate user
  const handleDelete = (profileUniqueId: string) => {
    const toastId = toast(
      <ConfirmToast
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            const { data } = await toggleUser({ variables: { profileUniqueId } });
            const response = data?.deleteUsersMutation?.response;

            if (response?.code == 9000) {               
              setUsers((prev) => prev.filter((u) => u.profileUniqueId !== profileUniqueId));
              toast.success("User deactivated successfully.");
            } else {
              toast.error(response?.message || "Failed to deactivate user.");
            }
          } catch {
            toast.error("An error occurred.");
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />
    );
  };

  // Save / Create user
  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      info("First name, last name and email are required");
      return;
    }

    const input: UserInputObject = {
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      profilePhone: phone,
      profileType: "NORMAL_PROFILE",
      profileTitle: profileTitle,
      profileGender: profileGender,
      password: password,
      profileLevel:'REGION' 
    };

    try {
      const { data } = await createUser({ variables: { input } });
      const response = data?.createUsersMutation?.response;
      const newUser = data?.createUsersMutation?.data?.userProfile;
      console.log('newUser',newUser);
      
      
      if (response?.code == 9000 && newUser) {
         
        setUsers((prev) => [newUser, ...prev]);
        closeModal();
        // this.a
      } else {
        error(response?.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      error("Mutation failed");
    }
  };

  // Loading / Error UI
  if (loading)
    return <Audio height="80" width="80" color="green" ariaLabel="loading" />;

  if (queryError)
    return (
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="error"
        visible
      />
    );

  return (
    <div className="p-2 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Users Information
        </h2>

        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-medium text-white"
        >
          Add User
        </button>
      </div>
      
      <UserTable users={users} onDelete={handleDelete} />
      
      <UserModal
      isOpen={isOpen}
      onClose={closeModal}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      profileType={profileType}
      setProfileType={setProfileType}
      profileTitle={profileTitle}
      setProfileTitle={setProfileTitle}
      profileGender={profileGender}
      setProfileGender={setProfileGender}
      password={password}
      setPassword={setPassword}
      onSave={handleSave}
    />

    </div>
  );
}
