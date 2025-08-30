import type { ReactElement } from "react";
import type { GlobalStore, Notification } from "../stores/global";
import type { IconComponentProps } from "../types/component";

export function addNotification(getNotifications: GlobalStore['getNotifications'], updateStore: GlobalStore['update'], icon: ReactElement<IconComponentProps>, text: string) {
   const notifications = getNotifications();
   const newNotification: Partial<Notification> = { icon, text };

   const notificationId = setTimeout(() => {
      const laterNotifications = getNotifications();
      const newNotifications = laterNotifications.filter(
         (notification) => notification.id !== notificationId
      );
      updateStore({ notifications: newNotifications });
   }, 3000);

   newNotification.id = notificationId;

   let updatedNotifications = [...notifications, newNotification as Notification];

   if (updatedNotifications.length > 3) {
      updatedNotifications = updatedNotifications.slice(-3);
   }

   updateStore({ notifications: updatedNotifications });
}
