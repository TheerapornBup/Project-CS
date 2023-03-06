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
} from "firebase/firestore";
import db from "../../firebase";

const noticesColRef = collection(db, "notices");

//create
export async function createNoticeFirebase(notice) {
  await addDoc(noticesColRef, notice);
}

//update
export async function updateNoticeFirebase(id, newData) {
  const noticeRef = doc(noticesColRef, id);
  await updateDoc(noticeRef, newData);
}

//get
export async function getNoticeByIdFirebase(id) {
  const noticeRef = doc(noticesColRef, id);
  const notice = await getDoc(noticeRef);
  const noticeData = notice.data();
  return { ...noticeData, noticeId: notice.id };
}

export async function getNoticesFirebase() {
  const q = query(noticesColRef, orderBy("createDateTime", "desc"));
  const noticesSnapshot = await getDocs(q);
  const notices = [];
  noticesSnapshot.forEach((notice) => {
    const noticeData = notice.data();
    notices.push({ ...noticeData, noticeId: notice.id });
  });
  return notices;
}

export async function getNoticesByUserIdFirebase(userId) {
  const q = query(
    noticesColRef,
    where("userId", "==", userId),
    orderBy("createDateTime", "desc")
  );
  const noticesSnapshot = await getDocs(q);
  const notices = [];
  noticesSnapshot.forEach((notice) => {
    const noticeData = notice.data();
    notices.push({ ...noticeData, noticeId: notice.id });
  });
  return notices;
}

//delete
export async function deleteNoticeFirebase(id) {
  const noticeRef = doc(noticesColRef, id);
  await deleteDoc(noticeRef);
}

export async function deleteNoticeByUserIdFirebase(userId) {
  const q = query(noticesColRef, where("userId", "==", userId));
  let noticesSnapshot = await getDocs(q);
  noticesSnapshot.forEach(async (notice) => {
    await deleteDoc(notice.ref);
  });
}
