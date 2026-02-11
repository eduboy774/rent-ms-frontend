import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_HOUSE_RENTALS, GET_HOUSES, GET_RENTERS, GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from '@apollo/client';
import { Audio, BallTriangle } from 'react-loader-spinner'
import { CreateHouseRentalMutation, CreateHouseRentalVars, HouseRental, HouseRentalFilteringInputObject, HouseRentalInputObject } from "../../../types/house-rentals";
import RoomHouseRentalsTable from "./house-rentals-table";
import { UserFilteringInputObject } from "../../../types/users";
import { useToast } from "../../../components/notifications/useToast";
import { HouseFilteringInputObject } from "../../../types/house";
import HouseRentalModal from "./house-rentals-modal";
import { RenterFilteringInputObject } from "../../../types/renters";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import { ACTIVATE_OR_DEACTIVATE_HOUSE_RENTAL, CREATE_HOUSE_RENTAL } from "../../../graphql/mutation";

export default function RoomHouseRentals() {
  
  const {isOpen, openModal, closeModal } = useModal();  
  const [houseRentals, setHouseRentals] = useState<HouseRental[]>([]);
  const [houseUuid,setHouseUid] = useState<string | null>(null);
  const [renterUuid, setRenterUuid] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState<boolean | false>(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [renters, setRenters] = useState<any[]>([]);
  const [houses,setHouses] = useState<any[]>([])
  const [amount, setAmount] = useState<number | null>(null);
  const [noticePeriodDays, setNoticePeriodDays] = useState<number | null>(null);


  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const { success,error,info } = useToast();

  const [createHouseRental] = useMutation<CreateHouseRentalMutation, CreateHouseRentalVars>(CREATE_HOUSE_RENTAL);
  const [deleteHouseRental] = useMutation(ACTIVATE_OR_DEACTIVATE_HOUSE_RENTAL);
  

  
  const defaultFilter: HouseRentalFilteringInputObject = {
  uuid: null,
  houseUuid: null,
  renterUuid: null,
  status: null,
};

 const defaultUserFilter: UserFilteringInputObject = {
  profileType: null,
  profileIsActive: true,
  pageNumber: 1,
};

const defaultRenterFilter: RenterFilteringInputObject = {
    uuid: null,
  };

 const defaultHouseFilter: HouseFilteringInputObject = {
   uuid: null,
   name: null,
 }; 


const options = owners.map(user => ({
  label: `${user.userFirstName} ${user.userLastName}`,
  value: user.profileUniqueId,
}));

const renterOptions = renters.map(renter =>({
    label:renter.fullName,
    value:renter.uuid
  })) 

const houseOptions = houses.map(house => ({
  label:house.name,
  value:house.uuid
}))


const { loading:LoadingHouseRental,error:HouseRentalError } = useQuery(GET_HOUSE_RENTALS, {
    variables: {filtering:defaultFilter}, 
    onCompleted: (data) => {
    setHouseRentals(data?.getHouseRentals?.data || []);
  }
  });


  useQuery(GET_USERS, {
      variables: { filtering: defaultUserFilter },
      onCompleted: (data) => {
        setOwners(data?.getUsers?.data || []);
      }
    });


      useQuery(GET_RENTERS, {
      variables: { filtering: defaultRenterFilter },
      onCompleted: (data) => {
        setRenters(data?.getRenters?.data || []);
      }
    });

    useQuery(GET_HOUSES, {
    variables: { filtering: defaultHouseFilter },
    onCompleted: (data) => {
      setHouses(data?.getHouses?.data || []);
    }
  });


     const handleDelete = (uuid: string) => {
      const toastId = toast(
        <ConfirmToast
          onConfirm={async () => {
            toast.dismiss(toastId);
            try {
              const { data } = await deleteHouseRental({ variables: { uuid } });
              const response = data?.deleteHouseRentalMutation?.response;
              console.log(response);
              
    
              if (response?.code === 9000) {
                setHouseRentals((prev) => prev.filter((pkg) => pkg.uuid !== uuid));
                toast.success("House Rental Delete successfully.");
              } else {
                toast.error(response?.message || "Failed to delete house rental.");
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
        
         if (amount == 0 || status =="" ){
              info('House Rental Description is Empty')
         }
    
          const input: HouseRentalInputObject = {
          uuid: null,
          amount:amount,
          status: status,
          duration:duration,
          autoRenew:autoRenew,
          houseUuid:houseUuid,
          renterUuid:renterUuid,

        };
    
     if(amount && status){
         try {
    
        const { data } = await createHouseRental({ variables: { input } });
        const responceHouseData:any = data?.createHouseRentalMutation;
        const newHouse = data?.createHouseRentalMutation.data;
        console.log("Create House Rental Response:", newHouse);
    
        if (responceHouseData?.response?.code === 9000 && newHouse ) {
             success(responceHouseData.response.message);
             setHouseRentals((prev) => [newHouse, ...prev]);
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
       
  
  

  if (LoadingHouseRental) return <Audio
  height="80"
  width="80"
  color="green"
  ariaLabel="three-dots-loading"
  wrapperStyle ={{}}
  wrapperClass = ""
/>;
  if (HouseRentalError) return 
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
             House Rentals Information
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
          Add Room House Rental
        </button>
      </div>
    
    <RoomHouseRentalsTable houseRentals={houseRentals} onDelete={handleDelete} />
    <HouseRentalModal
          isOpen={isOpen}
          onClose={closeModal}
          amount={amount}
          noticePeriodDays={noticePeriodDays}
          autoRenew={autoRenew}
          setAutoRenew={setAutoRenew}
          duration={duration}
          setDuration={setDuration}
          setAmount={setAmount}
          setNoticePeriodDays={setNoticePeriodDays}
          status={status}
          setStatus={setStatus}
          owners ={options}
          renters={renterOptions}
          renterUuid={renterUuid}
          houseUuid={houseUuid}
          houses={houseOptions}
          setHouseUuid={setHouseUid}
          setRenterUuid={setRenterUuid}
          onSave={handleSave}
          />
    </div>
  );
}
