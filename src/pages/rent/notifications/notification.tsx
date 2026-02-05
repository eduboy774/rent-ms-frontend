import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_NOTIFICATIONS } from "../../../graphql/queries";
import { useQuery } from '@apollo/client';
import { Audio, BallTriangle } from 'react-loader-spinner'
import { NotificationFilteringInputObject, Notifications } from "../../../types/notification";
import NotificationTable from "./notificationsTable";


export default function Notification() {
  const {openModal } = useModal();    
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const defaultFilter: NotificationFilteringInputObject = {
  medium: null,
  payload: null,
};


const { loading:LoadingHouse,error:HouseError } = useQuery(GET_NOTIFICATIONS, {
    variables: {filtering:defaultFilter}, 
    onCompleted: (data) => {
    setNotifications(data?.getNotifications?.data || []);
  }
  });

  
  

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
             Notification Information
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
          Add Notification
        </button>
      </div>
      
    
    <NotificationTable notifications={notifications} />

    </div>
  );
}
