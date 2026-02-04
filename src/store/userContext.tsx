import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the user profile data
interface UserProfile {
  // Define the properties of your user profile here
  userFirstName:string;
  userLastName:string;
  userEmail:string;
  profilePhone:string;
  profileGender:string;
  profileType:string;
  profileIsActive:boolean;
}

interface UserProfileAndRoleData {
  data: {
    userProfile: UserProfile;
  };
}

interface UserContextType {
  userProfileAndRoleData: UserProfileAndRoleData | null;
  setUserProfileAndRoleData: (data: UserProfileAndRoleData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfileAndRoleData, setUserProfileAndRoleData] = useState<UserProfileAndRoleData | null>(null);

  return (
    <UserContext.Provider value={{ userProfileAndRoleData, setUserProfileAndRoleData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
