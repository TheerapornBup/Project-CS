import {
  deleteChatByNoticeIdFirebase,
  deleteChatByVisitorIdFirebase,
  getChatByNoticeIdFirebase,
  getChatByVisitorIdFirebase,
} from "./firebases/chats";
import { deleteMessageByChatIdFirebase } from "./firebases/messages";
import {
  deleteNoticeFirebase,
  getNoticesByUserIdFirebase,
} from "./firebases/notices";
import { deleteNotificationByItemIdFirebase } from "./firebases/notifications";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { deleteUserFirebase } from "./firebases/users";

async function deleteMessageAndNotification(chatsList) {
  for (let i in chatsList) {
    await deleteMessageByChatIdFirebase(chatsList[i].chatId);
    await deleteNotificationByItemIdFirebase(chatsList[i].chatId);
  }
}

export async function deleteNoticeById(noticeId) {
  let chatsList = await getChatByNoticeIdFirebase(noticeId);
  await deleteMessageAndNotification(chatsList);
  await deleteNotificationByItemIdFirebase(noticeId);
  await deleteChatByNoticeIdFirebase(noticeId);
  await deleteNoticeFirebase(noticeId);

  await deleteImage(`${noticeId}/pic.jpg`);
  await deleteImage(`${noticeId}/idCardVisitor.jpg`);
  await deleteImage(`${noticeId}/idCardUser.jpg`);
}

async function deleteImage(path) {
  try {
    const storage = getStorage();
    await deleteObject(ref(storage, path));
  } catch (e) {
    console.log(e.message);
  }
}

export async function deleteUserAccount(userId) {
  // //delete all owner notice, chat, message, notification
  let noticesList = await getNoticesByUserIdFirebase(userId);
  for (let i in noticesList) {
    deleteNoticeById(noticesList[i].noticeId);
  }

  //delete all visitor chat, message, notification
  let chatsList = await getChatByVisitorIdFirebase(userId);
  await deleteMessageAndNotification(chatsList);
  await deleteChatByVisitorIdFirebase(userId);

  //delete account
  await deleteUserFirebase(userId);
}
