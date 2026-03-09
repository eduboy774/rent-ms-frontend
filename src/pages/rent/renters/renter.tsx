import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_RENTERS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

import { ACTIVATE_OR_DEACTIVATE_RENTER, CREATE_RENTER, UPDATE_RENTER } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";

import { RenterFilteringInputObject, RenterInputObject, Renters } from "../../../types/renters";
import RenterModal from "./renter-modal";
import RenterTable from "./renter-table";
import PageCard from "../../../components/common/PageCard";

export default function Renter() {
  const { isOpen, openModal, closeModal } = useModal();

  const [renterName, setRenterName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nidaNumber, setNidaNumber] = useState("");;
  const [profileTitle, setProfileTitle] = useState("");

  const [renters, setRenters] = useState<Renters[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const { success, error, info } = useToast();

  const [createRenter] = useMutation(CREATE_RENTER);
  const [updateRenter] = useMutation(UPDATE_RENTER);
  const [deleteRenter] = useMutation(ACTIVATE_OR_DEACTIVATE_RENTER);

  const defaultFilter: RenterFilteringInputObject = {
    uuid: null,
  };

 

  const { loading: LoadingRenter, error: RentersError } = useQuery(GET_RENTERS, {
    variables: { filtering: defaultFilter },
    fetchPolicy:"network-only",
    onCompleted: (data) => {
      setRenters(data?.getRenters?.data || []);
    },
  });



  /* ===== DELETE ===== */
  const handleDelete = (uuid: string) => {
    const toastId = toast(
      <ConfirmToast
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            const { data } = await deleteRenter({ variables: { uuid } });
            const response = data?.deleteRenterMutation?.response;

            if (response?.code === 9000) {
              setRenters((prev) => prev.filter((r) => r.uuid !== uuid));
              toast.success("Renter deleted successfully.");
            } else {
              toast.error(response?.message || "Failed to delete renter.");
            }
          } catch (err) {
            toast.error("An error occurred while deleting.");
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />
    );
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    if (renterName === "" || phoneNumber === null) {
      info("Renter name and phone number are required");
      return;
    }

    const input: RenterInputObject = {
      uuid: isEditing ? editingUuid : null,
      fullName: renterName,
      phoneNumber: phoneNumber,
      nidaNumber: nidaNumber,
      renterTitle: profileTitle,
    };

    try {
      if (isEditing) {
        const { data } = await updateRenter({ variables: { input } });
        const response: any = data?.updateRenterMutation;
        const updatedRenter = response?.data;

        if (response?.response?.code === 9000 && updatedRenter) {
          success(response.response.message);
          setRenters((prev) =>
            prev.map((r) => (r.uuid === editingUuid ? updatedRenter : r))
          );
          closeModal();
        } else {
          error(response?.response?.message);
        }
      } else {
        const { data } = await createRenter({ variables: { input } });
        const response: any = data?.createRenterMutation;
        const newRenter = response?.data;

        if (response?.response?.code === 9000 && newRenter) {
          success(response.response.message);
          setRenters((prev) => [newRenter, ...prev]);
          closeModal();
        } else {
          error(response?.response?.message);
        }
      }
    } catch (err) {
      console.error("Mutation error:", err);
      error(isEditing ? "Failed to update renter" : "Failed to create renter");
    }
  };


  if (LoadingRenter) return null;
  if (RentersError) return null;

  const resetForm = () => {
    setRenterName("");
    setPhoneNumber("");
    setNidaNumber("");
    setProfileTitle("");
    setIsEditing(false);
    setEditingUuid(null);
  };

  const handleAdd = () => {
    resetForm();
    openModal();
  };

  const handleEdit = (renter: Renters) => {
    setRenterName(renter.fullName || "");
    setPhoneNumber(renter.phoneNumber || "");
    setNidaNumber(renter.nidaNumber || "");
    setProfileTitle(renter.profileTitle || "");
    setEditingUuid(renter.uuid);
    setIsEditing(true);
    openModal();
  };

  return (
    <PageCard title="Renters" count={renters.length} countLabel="renter" onAdd={handleAdd} addLabel="Add Renter">
      <RenterTable renters={renters} onDelete={handleDelete} onEdit={handleEdit} />

      <RenterModal
        isOpen={isOpen}
        onClose={closeModal}
        fullName={renterName}
        setFullName={setRenterName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        nidaNumber={nidaNumber}
        setNidaNumber={setNidaNumber}
        renterTitle={profileTitle}
        setRenterTitle={setProfileTitle}
        onSave={handleSave}
        isEditing={isEditing}
      />
    </PageCard>
  );
}
