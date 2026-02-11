import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_HOUSES, GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from '@apollo/client';
import type { CreateHouseVars, CreateHouseMutation, House, HouseFilteringInputObject, HouseInputObject, UserFilteringInputObject } from "../../../types/house";
import { Audio, BallTriangle } from 'react-loader-spinner'
import { ACTIVATE_OR_DEACTIVATE_HOUSE, CREATE_HOUSE } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import HouseModal from "./houseModal";
import HouseTable from "./houseTable";


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



const { loading:LoadingHouse,error:HouseError, data:HouseData } = useQuery(GET_HOUSES, {
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
   

  

  if (LoadingHouse) return <Audio
  height="80"
  width="80"
  color="green"
  ariaLabel="three-dots-loading"
  wrapperStyle ={{}}
  wrapperClass = ""
/>;
  if (HouseError) return 
  <BallTriangle
  height={100}
  width={100}
  radius={5}
  color="#4fa94d"
  ariaLabel="ball-triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />;


  return (

    <div className="p-2 border border-gray-200  rounded-xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
             House Information
          </h2>
        </div>

        <button
          onClick={openModal}
          className="
          flex 
          w-full 
          items-center 
          justify-center 
          gap-2 rounded-full border border-gray-300 bg-orange-500 text-white px-4 py-3 text-sm font-medium shadow-theme-xs hover:bg-orange-500 hover:text-white dark:border-gray-700 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-500 dark:hover:text-white lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 2C9.27614 2 9.5 2.22386 9.5 2.5V8.5H15.5C15.7761 8.5 16 8.72386 16 9C16 9.27614 15.7761 9.5 15.5 9.5H9.5V15.5C9.5 15.7761 9.27614 16 9 16C8.72386 16 8.5 15.7761 8.5 15.5V9.5H2.5C2.22386 9.5 2 9.27614 2 9C2 8.72386 2.22386 8.5 2.5 8.5H8.5V2.5C8.5 2.22386 8.72386 2 9 2Z"
              fill=""
              className="font"
            />
          </svg>
          Add House
        </button>
      </div>
      
    
    <HouseTable houses={houses} onDelete={handleDelete} />

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
      
    </div>
  );
}
