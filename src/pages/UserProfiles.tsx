import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import { useUserContext } from "../store/userContext";
import { GET_USER_PROFILE } from "../graphql/queries";

export default function UserProfiles() {
  const { userProfileAndRoleData, setUserProfileAndRoleData } = useUserContext();

  // Only fetch if context was cleared (e.g. page refresh)
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    skip: !!userProfileAndRoleData,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getUserProfileAndRole) {
      setUserProfileAndRoleData(data.getUserProfileAndRole);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <>
    
      <div className="space-y-6">
        <UserMetaCard />
        <UserInfoCard />
        <UserAddressCard />
      </div>
    </>
  );
}
