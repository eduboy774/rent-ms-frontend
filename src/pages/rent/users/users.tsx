
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
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
import PageCard from "../../../components/common/PageCard";
import PageLayout from "../../../components/common/PageLayout";

export default function UserPage() {
  const { isOpen, openModal, closeModal } = useModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileType, setProfileType] = useState("NORMAL_PROFILE");
  const [profileTitle, setProfileTitle] = useState("Mr");
  const [profileGender, setProfileGender] = useState("MALE");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const { error, info } = useToast();

  const [createUser] = useMutation<CreateUserMutation, CreateUserVars>(CREATE_USER);
  const [toggleUser] = useMutation(ACTIVATE_OR_DEACTIVATE_USER);

  const defaultUserFilter: UserFilteringInputObject = {
    profileType: null,
    profileIsActive: true,
    pageNumber: 1,
  };

  useQuery(GET_USERS, {
    variables: { filtering: defaultUserFilter },
    fetchPolicy:"network-only",
    onCompleted: (data) => {
      setUsers(data?.getUsers?.data || []);
    },
  });

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
      
      if (response?.code == 9000 && newUser) {
        setUsers((prev) => [newUser, ...prev]);
        closeModal();
      } else {
        error(response?.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      error("Mutation failed");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setProfileType("NORMAL_PROFILE");
    setProfileTitle("Mr");
    setProfileGender("MALE");
    setPassword("");
    setIsEditing(false);
  };

  const handleAdd = () => {
    resetForm();
    openModal();
  };

  const handleEdit = (user: User) => {
    setFirstName(user.userFirstName || "");
    setLastName(user.userLastName || "");
    setEmail(user.userEmail || "");
    setPhone(user.profilePhone || "");
    setProfileType(user.profileType || "NORMAL_PROFILE");
    setProfileTitle(user.profileTitle || "Mr");
    setProfileGender(user.profileGender || "MALE");
    setPassword("");
    setIsEditing(true);
    openModal();
  };

  return (
    <PageLayout
      title="Users"
      description="Manage system users"
    >
      <PageCard title="Users" count={users.length} countLabel="user" onAdd={handleAdd} addLabel="Add User">
        <UserTable users={users} onDelete={handleDelete} onEdit={handleEdit} />
        
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
        isEditing={isEditing}
      />

      </PageCard>
    </PageLayout>
  );
}
