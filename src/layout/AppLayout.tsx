import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useUserContext } from "../store/userContext";
import { GET_USER_PROFILE } from "../graphql/queries";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { userProfileAndRoleData, setUserProfileAndRoleData } = useUserContext();

  // Fetch the current user's profile once per session (skipped if already in context)
  const { data } = useQuery(GET_USER_PROFILE, {
    skip: !!userProfileAndRoleData,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getUserProfileAndRole) {
      setUserProfileAndRoleData(data.getUserProfileAndRole);
    }
  }, [data]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[280px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
