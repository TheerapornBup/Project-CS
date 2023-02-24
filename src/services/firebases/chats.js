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
} from "firebase/firestore";
import db from "../../firebase";

const chatsColRef = collection(db, "chats");

//create
export async function createChatFirebase(chat) {
  const chatData = await addDoc(chatsColRef, chat);
  return chatData.id;
}

//update
export async function updateChatFirebase(id, newData) {
  const chatRef = doc(chatsColRef, id);
  await updateDoc(chatRef, newData);
}

//get
export async function getChatByIdFirebase(id) {
  const chatRef = doc(chatsColRef, id);
  const chat = await getDoc(chatRef);
  return chat.data();
}

export async function getChatsFirebase() {
  const chatsSnapshot = await getDocs(chatsColRef);
  const chats = [];
  chatsSnapshot.forEach((chat) => {
    const chatData = chat.data();
    chats.push({ ...chatData, chatId: chat.id });
  });
  return chats;
}

export async function getChatFirebase(noticeId, visitorId) {
  let chatId = null;
  const q = query(
    chatsColRef,
    where("noticeId", "==", noticeId),
    where("visitorId", "==", visitorId)
  );
  let chatsSnapshot = await getDocs(q);
  if (!chatsSnapshot.empty) {
    chatsSnapshot.forEach((chat) => {
      chatId = chat.id;
    });
  }
  return chatId;
}
export async function getChatByNoticeIdFirebase(noticeId) {
  let chats = [];
  const q = query(chatsColRef, where("noticeId", "==", noticeId));
  let chatsSnapshot = await getDocs(q);
  if (!chatsSnapshot.empty) {
    chatsSnapshot.forEach((chat) => {
      const chatData = chat.data();
      chats.push({ ...chatData, chatId: chat.id });
    });
  }

  return chats;
}
export async function getChatByVisitorIdFirebase(visitorId) {
  let chats = [];
  const q = query(chatsColRef, where("visitorId", "==", visitorId));
  let chatsSnapshot = await getDocs(q);
  if (!chatsSnapshot.empty) {
    chatsSnapshot.forEach((chat) => {
      const chatData = chat.data();
      chats.push({ ...chatData, chatId: chat.id });
    });
  }

  return chats;
}

//delete
export async function deleteChatFirebase(id) {
  const chatRef = doc(chatsColRef, id);
  await deleteDoc(chatRef);
}

export async function deleteChatByNoticeIdFirebase(noticeId) {
  const q = query(chatsColRef, where("noticeId", "==", noticeId));
  let chatsSnapshot = await getDocs(q);
  chatsSnapshot.forEach(async (chat) => {
    await deleteDoc(chat.ref);
  });
}

export async function deleteChatByVisitorIdFirebase(visitorId) {
  const q = query(chatsColRef, where("visitorId", "==", visitorId));
  let chatsSnapshot = await getDocs(q);
  chatsSnapshot.forEach(async (chat) => {
    await deleteDoc(chat.ref);
  });
}
