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
  try {
    let chatsList = await getChatByNoticeIdFirebase(noticeId);
    await deleteMessageAndNotification(chatsList);
    await deleteNotificationByItemIdFirebase(noticeId);
    await deleteChatByNoticeIdFirebase(noticeId);
    await deleteNoticeFirebase(noticeId);

    const storage = getStorage();
    const desertRef = ref(storage, `${noticeId}.jpg`);
    await deleteObject(desertRef);
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
