import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_HOUSES, GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from '@apollo/client';
import type { CreateHouseVars, CreateHouseMutation, House, HouseFilteringInputObject, HouseInputObject, UserFilteringInputObject } from "../../../types/house";
import { ACTIVATE_OR_DEACTIVATE_HOUSE, CREATE_HOUSE } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import HouseModal from "./houseModal";
import HouseTable from "./houseTable";
import PageCard from "../../../components/common/PageCard";


export default function House() {
  const {isOpen, openModal, closeModal } = useModal();  
  const [message, setMessage] = useState("");
  const [houseName, setHouseName] = useState("");
  const [ownerUuid, setOwnerUuid] = useState<string | null>(null);
  
  const [houses, setHouses] = useState<House[]>([]);
  const [owners, setOwners] = useState<any[]>([]);

  const [createHouse] = useMutation<CreateHouseMutation, CreateHouseVars>(CREATE_HOUSE);
  const [deleteHouse] = useMutation(ACTIVATE_OR_DEACTIVATE_HOUSE);

  const { success,error,info } = useToast();

  const defaultFilter: HouseFilteringInputObject = {
  uuid: null,
  name: null,
};

 const defaultUserFilter: UserFilteringInputObject = {
  profileType: null,
  profileIsActive: true,
  pageNumber: 1,
};


const options = owners.map(user => ({
  label: `${user.userFirstName} ${user.userLastName}`,
  value: user.profileUniqueId,
}));



useQuery(GET_HOUSES, {
    variables: {filtering:defaultFilter}, 
    fetchPolicy:"network-only",
    onCompleted: (data) => {
    setHouses(data?.getHouses?.data || []);
  }
  });

  useQuery(GET_USERS, {
    variables: { filtering: defaultUserFilter },
    fetchPolicy:"network-only",
    onCompleted: (data) => {
      setOwners(data?.getUsers?.data || []);
    }
  });


 const handleDelete = (uuid: string) => {
  const toastId = toast(
    <ConfirmToast
      onConfirm={async () => {
        toast.dismiss(toastId);
        try {
          const { data } = await deleteHouse({ variables: { uuid } });
          const response = data?.deleteHouseMutation?.response;

          if (response?.code === 9000) {
            setHouses((prev) => prev.filter((pkg) => pkg.uuid !== uuid));
            toast.success("House deleted successfully.");
          } else {
            toast.error(response?.message || "Failed to delete house.");
          }
        } catch (err) {
          toast.error("An error occurred while deleting.");
        }
      }}
      onCancel={() => toast.dismiss(toastId)}
    />
  );
};



  const handleSave = async () => {
    
     if (houseName == "" || message =="" ){
          info('House Name Description is Empty')
     }

      const input: HouseInputObject = {
      uuid: null,
      name:houseName,
      description: message,
      ownerUuid: ownerUuid,
    };

 if(houseName && message){
     try {

    const { data } = await createHouse({ variables: { input } });
    const responceHouseData:any = data?.createHouseMutation;
    const newHouse = data?.createHouseMutation.data;
    console.log("Create House Response:", newHouse);

    if (responceHouseData?.response?.code === 9000 && newHouse ) {
         success(responceHouseData.response.message);
         setHouses((prev) => [newHouse, ...prev]);
        closeModal();
    } else {
      error(responceHouseData.response.message)
    }
  } catch (err) {
        console.error("Mutation error:",err);
  }

    closeModal();
  };
 }
   

  

  return (
    <PageCard title="Houses" count={houses.length} countLabel="house" onAdd={openModal} addLabel="Add House">
    <HouseTable houses={houses} onDelete={handleDelete} onEdit={() => openModal()} />

     <HouseModal
      isOpen={isOpen}
      onClose={closeModal}
      houseName={houseName}
      setHouseName={setHouseName}
      message={message}
      setMessage={setMessage}
      owners ={options}
      ownerUuid={ownerUuid}
      setOwnerUuid ={setOwnerUuid}  
      onSave={handleSave}
      />
      
    </PageCard>
  );
}
