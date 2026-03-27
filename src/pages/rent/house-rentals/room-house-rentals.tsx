import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_HOUSE_RENTALS, GET_HOUSES, GET_RENTERS, GET_USERS } from "../../../graphql/queries";
import { useMutation, useQuery } from '@apollo/client';
import { CreateHouseRentalMutation, CreateHouseRentalVars, HouseRental, HouseRentalFilteringInputObject, HouseRentalInputObject } from "../../../types/house-rentals";
import RoomHouseRentalsTable from "./house-rentals-table";
import { UserFilteringInputObject } from "../../../types/users";
import { useToast } from "../../../components/notifications/useToast";
import { HouseFilteringInputObject } from "../../../types/house";
import HouseRentalModal from "./house-rentals-modal";
import { RenterFilteringInputObject } from "../../../types/renters";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import { ACTIVATE_OR_DEACTIVATE_HOUSE_RENTAL, CREATE_HOUSE_RENTAL, UPDATE_HOUSE_RENTAL } from "../../../graphql/mutation";
import PageCard from "../../../components/common/PageCard";
import PageLayout from "../../../components/common/PageLayout";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const { success,error,info } = useToast();

  const [createHouseRental] = useMutation<CreateHouseRentalMutation, CreateHouseRentalVars>(CREATE_HOUSE_RENTAL);
  const [updateHouseRental] = useMutation(UPDATE_HOUSE_RENTAL);
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
    fetchPolicy:"network-only",
    onCompleted: (data) => {
    setHouseRentals(data?.getHouseRentals?.data || []);
  }
  });


  useQuery(GET_USERS, {
      variables: { filtering: defaultUserFilter },
      fetchPolicy:"network-only",
      onCompleted: (data) => {
        setOwners(data?.getUsers?.data || []);
      }
    });


      useQuery(GET_RENTERS, {
      variables: { filtering: defaultRenterFilter },
      fetchPolicy:"network-only",
      onCompleted: (data) => {
        setRenters(data?.getRenters?.data || []);
      }
    });

    useQuery(GET_HOUSES, {
    variables: { filtering: defaultHouseFilter },
    fetchPolicy:"network-only",
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
                setHouseRentals((prev) => prev.filter((item) => item.uuid !== uuid));
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
          uuid: isEditing ? editingUuid : null,
          amount: amount,
          status: status,
          duration: duration,
          autoRenew: autoRenew,
          houseUuid: houseUuid,
          renterUuid: renterUuid,
        };
    
     if(amount && status){
         try {

        if (isEditing) {
          const { data } = await updateHouseRental({ variables: { input } });
          const responseData: any = data?.updateHouseRentalMutation;
          const updatedRental = responseData?.data;

          if (responseData?.response?.code === 9000 && updatedRental) {
            success(responseData.response.message);
            setHouseRentals((prev) =>
              prev.map((r) => (r.uuid === editingUuid ? updatedRental : r))
            );
            closeModal();
          } else {
            error(responseData?.response?.message);
          }
        } else {
          const { data } = await createHouseRental({ variables: { input } });
          const responceHouseData: any = data?.createHouseRentalMutation;
          const newHouse = data?.createHouseRentalMutation.data;

          if (responceHouseData?.response?.code === 9000 && newHouse) {
            success(responceHouseData.response.message);
            setHouseRentals((prev) => [newHouse, ...prev]);
            closeModal();
          } else {
            error(responceHouseData.response.message);
          }
        }
      } catch (err) {
            console.error("Mutation error:",err);
      }
      };
     }
        
   
 

  if (LoadingHouseRental) return null;
  if (HouseRentalError) return null;


  const resetForm = () => {
    setHouseUid(null);
    setRenterUuid(null);
    setAmount(null);
    setNoticePeriodDays(null);
    setAutoRenew(false);
    setDuration("");
    setStatus("");
    setIsEditing(false);
    setEditingUuid(null);
  };

  const handleAdd = () => {
    resetForm();
    openModal();
  };

  const handleEdit = (rental: HouseRental) => {
    setHouseUid(rental.house?.uuid || null);
    setRenterUuid(rental.renter?.uuid || null);
    setAmount(rental.amount ? Number(rental.amount) : null);
    setNoticePeriodDays(rental.noticePeriodDays ?? null);
    setAutoRenew(rental.autoRenew ?? false);
    setDuration(rental.duration || "");
    setStatus(rental.status || "");
    setEditingUuid(rental.uuid);
    setIsEditing(true);
    openModal();
  };

  return (
    <PageLayout
      title="House Rentals"
      description="Manage rental agreements"
    >
      <PageCard title="House Rentals" count={houseRentals.length} countLabel="rental" onAdd={handleAdd} addLabel="Add House Rental">
      <RoomHouseRentalsTable houseRentals={houseRentals} onDelete={handleDelete} onEdit={handleEdit} />
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
            isEditing={isEditing}
            />
      </PageCard>
    </PageLayout>
  );
}
