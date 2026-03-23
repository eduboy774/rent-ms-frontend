import { useState } from "react";
import { GET_NOTIFICATIONS } from "../../../graphql/queries";
import { useQuery } from '@apollo/client';
import { NotificationFilteringInputObject, Notifications } from "../../../types/notification";
import NotificationTable from "./notificationsTable";
import PageCard from "../../../components/common/PageCard";
import PageLayout from "../../../components/common/PageLayout";


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
    <PageLayout
      title="Notifications"
      description="View and manage notifications"
    >
      <PageCard title="Notifications" count={notifications.length} countLabel="notification">
        <NotificationTable notifications={notifications} />
      </PageCard>
    </PageLayout>
  );
}
