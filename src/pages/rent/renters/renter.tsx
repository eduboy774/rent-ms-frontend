import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_RENTERS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

import { ACTIVATE_OR_DEACTIVATE_RENTER, CREATE_RENTER } from "../../../graphql/mutation";
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
  const { success, error, info } = useToast();

  const [createRenter] = useMutation(CREATE_RENTER);
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
      uuid: null,
      fullName: renterName,
      phoneNumber: phoneNumber,
      nidaNumber: nidaNumber,
      renterTitle:profileTitle
    };



    try {
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
    } catch (err) {
      console.error("Mutation error:", err);
      error("Failed to create renter");
    }
  };


  if (LoadingRenter) return null;
  if (RentersError) return null;

  return (
    <PageCard title="Renters" count={renters.length} countLabel="renter" onAdd={openModal} addLabel="Add Renter">
      <RenterTable renters={renters} onDelete={handleDelete} onEdit={() => openModal()} />

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
      />
    </PageCard>
  );
}
