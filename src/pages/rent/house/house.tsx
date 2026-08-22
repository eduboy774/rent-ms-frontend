import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_COUNCILS, GET_DISTRICTS, GET_HOUSES, GET_REGIONS, GET_USERS, GET_WARDS } from "../../../graphql/queries";
import { useMutation, useQuery } from '@apollo/client';
import type { CreateHouseVars, CreateHouseMutation, House, HouseFilteringInputObject, HouseInputObject, UserFilteringInputObject } from "../../../types/house";
import type { Council, District, Region, Ward } from "../../../types/geography";
import { ACTIVATE_OR_DEACTIVATE_HOUSE, CREATE_HOUSE, UPDATE_HOUSE } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";
import HouseModal from "./houseModal";
import HouseTable from "./houseTable";
import PageCard from "../../../components/common/PageCard";
import PageLayout from "../../../components/common/PageLayout";


export default function House() {
  const {isOpen, openModal, closeModal } = useModal();  
  const [message, setMessage] = useState("");
  const [houseName, setHouseName] = useState("");
  const [ownerUuid, setOwnerUuid] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  // Location hierarchy: each selection is the filter for the level below it.
  const [regionUuid, setRegionUuid] = useState<string | null>(null);
  const [districtUuid, setDistrictUuid] = useState<string | null>(null);
  const [councilUuid, setCouncilUuid] = useState<string | null>(null);
  const [wardUuid, setWardUuid] = useState<string | null>(null);

  const [houses, setHouses] = useState<House[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [councils, setCouncils] = useState<Council[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [createHouse] = useMutation<CreateHouseMutation, CreateHouseVars>(CREATE_HOUSE);
  const [updateHouse] = useMutation(UPDATE_HOUSE);
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

const regionOptions = regions.map(region => ({
  label: region.reginalName,
  value: region.regionalUniqueId,
}));

const districtOptions = districts.map(district => ({
  label: district.districtName,
  value: district.districtUniqueId,
}));

const councilOptions = councils.map(council => ({
  label: council.councilName,
  value: council.councilUniqueId,
}));

const wardOptions = wards.map(ward => ({
  label: ward.wardName,
  value: ward.wardUniqueId,
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

  useQuery(GET_REGIONS, {
    variables: { filtering: { uuid: null, name: null } },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setRegions(data?.getRegions?.data || []);
    }
  });

  // Districts of the chosen region
  useQuery(GET_DISTRICTS, {
    variables: { filtering: { regionUuid } },
    skip: !regionUuid,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setDistricts(data?.getDistricts?.data || []);
    }
  });

  // Councils of the chosen district
  useQuery(GET_COUNCILS, {
    variables: { filtering: { districtUuid } },
    skip: !districtUuid,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setCouncils(data?.getCouncils?.data || []);
    }
  });

  // Wards of the chosen council — this is the value actually stored on the house
  useQuery(GET_WARDS, {
    variables: { filtering: { councilUuid } },
    skip: !councilUuid,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setWards(data?.getWards?.data || []);
    }
  });


 // Changing a level invalidates everything below it, so stale children are cleared.
 const handleRegionChange = (value: string) => {
   setRegionUuid(value || null);
   setDistrictUuid(null);
   setCouncilUuid(null);
   setWardUuid(null);
   setDistricts([]);
   setCouncils([]);
   setWards([]);
 };

 const handleDistrictChange = (value: string) => {
   setDistrictUuid(value || null);
   setCouncilUuid(null);
   setWardUuid(null);
   setCouncils([]);
   setWards([]);
 };

 const handleCouncilChange = (value: string) => {
   setCouncilUuid(value || null);
   setWardUuid(null);
   setWards([]);
 };

 const handleWardChange = (value: string) => {
   setWardUuid(value || null);
 };


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
    uuid: isEditing ? editingUuid : null,
    name:houseName,
    description: message,
    ownerUuid: ownerUuid,
    wardUuid: wardUuid,
  };

if(houseName && message){
   try {

  if (isEditing) {
    const { data } = await updateHouse({ variables: { input } });
    const responseData: any = data?.updateHouseMutation;
    const updatedHouse = responseData?.data;

    if (responseData?.response?.code === 9000 && updatedHouse) {
      success(responseData.response.message);
      setHouses((prev) =>
        prev.map((h) => (h.uuid === editingUuid ? updatedHouse : h))
      );
      closeModal();
    } else {
      error(responseData?.response?.message);
    }
  } else {
    const { data } = await createHouse({ variables: { input } });
    const responceHouseData: any = data?.createHouseMutation;
    const newHouse = data?.createHouseMutation.data;

    if (responceHouseData?.response?.code === 9000 && newHouse) {
      success(responceHouseData.response.message);
      setHouses((prev) => [newHouse, ...prev]);
      closeModal();
    } else {
      error(responceHouseData.response.message);
    }
  }
} catch (err) {
      console.error("Mutation error:",err);
  }
  }
 }


 

 const resetForm = () => {
   setHouseName("");
   setMessage("");
   setOwnerUuid(null);
   setRegionUuid(null);
   setDistrictUuid(null);
   setCouncilUuid(null);
   setWardUuid(null);
   setDistricts([]);
   setCouncils([]);
   setWards([]);
   setIsEditing(false);
   setEditingUuid(null);
 };

 const handleAdd = () => {
   resetForm();
   openModal();
 };

 const handleEdit = (house: House) => {
   setHouseName(house.name || "");
   setMessage(house.description || "");
   setOwnerUuid(house.ownerUuid || house.ownerInfo?.profileUniqueId || null);

   // Walk the stored ward back up the chain so every dropdown opens pre-selected.
   const ward = house.ward;
   const council = ward?.wardParentCouncil ?? null;
   const district = council?.councilParentDistrict ?? null;
   const region = district?.districtParentRegion ?? null;

   setRegionUuid(region?.regionalUniqueId ?? null);
   setDistrictUuid(district?.districtUniqueId ?? null);
   setCouncilUuid(council?.councilUniqueId ?? null);
   setWardUuid(ward?.wardUniqueId ?? null);

   setEditingUuid(house.uuid);
   setIsEditing(true);
   openModal();
 };

 return (
  <PageLayout
   title="Houses"
   description="Manage your rental properties"
  >
   <PageCard title="Houses" count={houses.length} countLabel="house" onAdd={handleAdd} addLabel="Add House">
   <HouseTable houses={houses} onDelete={handleDelete} onEdit={handleEdit} />

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
     regions={regionOptions}
     regionUuid={regionUuid}
     setRegionUuid={handleRegionChange}
     districts={districtOptions}
     districtUuid={districtUuid}
     setDistrictUuid={handleDistrictChange}
     councils={councilOptions}
     councilUuid={councilUuid}
     setCouncilUuid={handleCouncilChange}
     wards={wardOptions}
     wardUuid={wardUuid}
     setWardUuid={handleWardChange}
     onSave={handleSave}
     isEditing={isEditing}
     />
    
   </PageCard>
   </PageLayout>
 );
}
