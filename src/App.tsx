import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import House from "./pages/rent/house/house";
import User from "./pages/rent/users/users";
import Notification from "./pages/rent/notifications/notification";
import RoomHouseRentals from "./pages/rent/house-rentals/room-house-rentals";
import Renter from "./pages/rent/renters/renter";
import Payments from "./pages/rent/payments/payments";
import { useUserContext } from "./store/userContext";

const AdminRoute = () => {
  const { userProfileAndRoleData } = useUserContext();
  const isAdmin = userProfileAndRoleData?.data?.userProfile?.profileType === 'ADMIN_PROFILE';
  
  if (!isAdmin) return <Navigate to="/home" replace />;
  return <Outlet />;
};

export default function App() {
  return (
     
    <>
      
      <Router>
      <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />

            {/* Start of Vilcom */}

             <Route element={<AdminRoute />}>
               <Route path="/users"  element={<User/>}/>
             </Route>
             <Route path="/houses"  element={<House/>}/>
             <Route path="/renters"  element={<Renter/>}/>
              <Route path="/notifications"  element={<Notification/>}/>
                <Route path="/house-rentals"  element={<RoomHouseRentals/>}/>
                <Route path="/payments"  element={<Payments/>}/>



 
             {/* End  of Vilcom */}

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route index path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    
    </>
  );
}
