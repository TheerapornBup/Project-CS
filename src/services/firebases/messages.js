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
  limit,
} from "firebase/firestore";
import db from "../../firebase";

const messagesColRef = collection(db, "messages");

//create
export async function createMessageFirebase(message) {
  const messageData = await addDoc(messagesColRef, message);
  return messageData.id;
}

//update
export async function updateMessageFirebase(id, newData) {
  const messageRef = doc(messagesColRef, id);
  await updateDoc(messageRef, newData);
}

//get
export async function getMessageByIdFirebase(id) {
  const messageRef = doc(messagesColRef, id);
  const message = await getDoc(messageRef);
  return message.data();
}

export async function getMessagesFirebase() {
  const messagesSnapshot = await getDocs(messagesColRef);
  const messages = [];
  messagesSnapshot.forEach((message) => {
    const messageData = message.data();
    messages.push({ ...messageData, messageId: message.id });
  });
  return messages;
}

export async function getMessageByChatIdFirebase(chatId) {
  const q = query(
    messagesColRef,
    where("chatId", "==", chatId),
    orderBy("dateTime")
  );
  let messagesSnapshot = await getDocs(q);

  const messages = [];
  if (!messagesSnapshot.empty) {
    messagesSnapshot.forEach((message) => {
      const messageData = message.data();
      messages.push(messageData);
    });
  }
  return messages;
}

export async function getLastestMessageByChatIdFirebase(chatId, sender) {
  const q = query(
    messagesColRef,
    where("chatId", "==", chatId),
    where("sender", "==", sender),
    orderBy("dateTime", "desc"),
    limit(1)
  );
  let messagesSnapshot = await getDocs(q);
  console.log(messagesSnapshot);

  let messages = null;
  if (!messagesSnapshot.empty) {
    messagesSnapshot.forEach((message) => {
      const messageData = message.data();
      messages = messageData;
    });
  }
  return messages;
}

//delete
export async function deleteMessageFirebase(id) {
  const messageRef = doc(messagesColRef, id);
  await deleteDoc(messageRef);
}

export async function deleteMessageByChatIdFirebase(chatId) {
  const q = query(messagesColRef, where("chatId", "==", chatId));

  let messagesSnapshot = await getDocs(q);
  messagesSnapshot.forEach(async (message) => {
    await deleteDoc(message.ref);
  });
}
