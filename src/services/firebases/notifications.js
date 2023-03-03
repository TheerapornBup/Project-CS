import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import db from "../../firebase";

const notificationsColRef = collection(db, "notifications");

//create
export async function createNotificationFirebase(notification) {
  await addDoc(notificationsColRef, notification);
}

//update
export async function updateNotificationFirebase(id, newData) {
  const notificationRef = doc(notificationsColRef, id);
  await updateDoc(notificationRef, newData);
}

//get
export async function getNotificationByIdFirebase(id) {
  const notificationRef = doc(notificationsColRef, id);
  const notification = await getDoc(notificationRef);
  return notification.data();
}

export async function getNotificationsFirebase() {
  const q = query(notificationsColRef, orderBy("createDateTime", "desc"));
  const notificationsSnapshot = await getDocs(q);
  const notifications = [];
  notificationsSnapshot.forEach((notification) => {
    const notificationData = notification.data();
    notifications.push({
      ...notificationData,
      notificationId: notification.id,
    });
  });
  return notifications;
}

export async function getNotificationsByUserIdFirebase(userId) {
  const q = query(
    notificationsColRef,
    where("userId", "==", userId),
    orderBy("dateTime", "desc")
  );
  const notificationsSnapshot = await getDocs(q);
  const notifications = [];
  notificationsSnapshot.forEach((notification) => {
    const notificationData = notification.data();
    notifications.push({
      ...notificationData,
      notificationId: notification.id,
    });
  });
  return notifications;
}

//delete
export async function deleteNotificationFirebase(id) {
  const notificationRef = doc(notificationsColRef, id);
  await deleteDoc(notificationRef);
}

export async function deleteNotificationByUserIdFirebase(userId) {
  const q = query(notificationsColRef, where("userId", "==", userId));
  let notificationsSnapshot = await getDocs(q);
  notificationsSnapshot.forEach(async (notification) => {
    await deleteDoc(notification.ref);
  });
}

//check
export async function isExistNotificationFirebase(type, itemId) {
  const q = query(
    notificationsColRef,
    where("type", "==", type),
    where("itemId", "==", itemId)
  );
  const notificationsSnapshot = await getCountFromServer(q);

  return notificationsSnapshot.data().count > 0;
}

export async function isMatchNotificationFirebase(type, itemId, userId) {
  let notificationId = null;
  const q = query(
    notificationsColRef,
    where("type", "==", type),
    where("itemId", "==", itemId),
    where("userId", "==", userId)
  );
  let notificationsSnapshot = await getDocs(q);

  if (!notificationsSnapshot.empty) {
    notificationsSnapshot.forEach((notification) => {
      notificationId = notification.id;
    });
  }
  return notificationId;
}
