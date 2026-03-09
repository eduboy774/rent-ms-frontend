import { useState } from "react";
import { GET_NOTIFICATIONS } from "../../../graphql/queries";
import { useQuery } from '@apollo/client';
import { NotificationFilteringInputObject, Notifications } from "../../../types/notification";
import NotificationTable from "./notificationsTable";
import PageCard from "../../../components/common/PageCard";


export default function Notification() {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const defaultFilter: NotificationFilteringInputObject = {
  medium: null,
  payload: null,
};


useQuery(GET_NOTIFICATIONS, {
    variables: {filtering:defaultFilter}, 
    onCompleted: (data) => {
    setNotifications(data?.getNotifications?.data || []);
  }
  });


  return (
    <PageCard title="Notifications" count={notifications.length} countLabel="notification">
      <NotificationTable notifications={notifications} />
    </PageCard>
  );
}
