import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_RENTERS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";


import { Audio, BallTriangle } from "react-loader-spinner";
import { ACTIVATE_OR_DEACTIVATE_RENTER, CREATE_RENTER } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";

import { RenterFilteringInputObject, RenterInputObject, Renters } from "../../../types/renters";
import RenterModal from "./renter-modal";
import RenterTable from "./renter-table";

export default function Renter() {
  const { isOpen, openModal, closeModal } = useModal();

  const [renterName, setRenterName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<number | null>(null);
  const [nidaNumber, setNidaNumber] = useState("");;

  const [renters, setRenters] = useState<Renters[]>([]);
  const { success, error, info } = useToast();

  const [createRenter] = useMutation(CREATE_RENTER);
  const [deleteRenter] = useMutation(ACTIVATE_OR_DEACTIVATE_RENTER);

  const defaultFilter: RenterFilteringInputObject = {
    uuid: null,
  };

 

  const { loading: LoadingRenter,error: RentersError } = useQuery(GET_RENTERS, {
    variables: { filtering: defaultFilter },
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


  if (LoadingRenter)
    return (
      <Audio
        height="80"
        width="80"
        color="green"
        ariaLabel="three-dots-loading"
      />
    );

  if (RentersError)
    return (
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        visible
      />
    );

  return (
    <div className="p-2 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Renter Information
          </h2>
        </div>

        <button
          onClick={openModal}
          className="
            flex w-full items-center justify-center gap-2
            rounded-full border border-gray-300
            bg-orange-500 px-4 py-3 text-sm font-medium
            text-white shadow-theme-xs
            hover:bg-orange-500 hover:text-white
            dark:border-gray-700 dark:bg-orange-500
            dark:text-white dark:hover:bg-orange-500
            lg:inline-flex lg:w-auto
          "
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 2C9.27614 2 9.5 2.22386 9.5 2.5V8.5H15.5C15.7761 8.5 16 8.72386 16 9C16 9.27614 15.7761 9.5 15.5 9.5H9.5V15.5C9.5 15.7761 9.27614 16 9 16C8.72386 16 8.5 15.7761 8.5 15.5V9.5H2.5C2.22386 9.5 2 9.27614 2 9C2 8.72386 2.22386 8.5 2.5 8.5H8.5V2.5C8.5 2.22386 8.72386 2 9 2Z"
            />
          </svg>
          Add Renter
        </button>
      </div>

      <RenterTable renters={renters} onDelete={handleDelete} />

      <RenterModal
        isOpen={isOpen}
        onClose={closeModal}
        fullName={renterName}
        setFullName={setRenterName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        nidaNumber={nidaNumber}
        setNidaNumber={setNidaNumber}
        onSave={handleSave}
      />
    </div>
  );
}
