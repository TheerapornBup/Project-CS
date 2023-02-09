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
  getCountFromServer,
} from "firebase/firestore";
import db from "../../firebase";

const usersColRef = collection(db, "users");

export async function createUserFirebase(user) {
  await addDoc(usersColRef, user);
}

export async function getUserByIdFirebase(id) {
  const userRef = doc(usersColRef, id);
  const user = await getDoc(userRef);
  return user.data();
}

export async function updateUserFirebase(id, newData) {
  const userRef = doc(usersColRef, id);
  await updateDoc(userRef, newData);
}

export async function getUsersFirebase() {
  const usersSnapshot = await getDocs(usersColRef);
  const users = [];
  usersSnapshot.forEach((user) => {
    const userData = user.data();
    users.push(userData);
  });
  return users;
}

export async function deleteUserFirebase(id) {
  const userRef = doc(usersColRef, id);
  await deleteDoc(userRef);
}

export async function isMatchUserFirebase(username, password) {
  let userId = null;

  const isEmail = username.includes("@");
  const q = query(
    usersColRef,
    where(isEmail ? "email" : "username", "==", username),
    where("password", "==", password)
  );
  let usersSnapshot = await getDocs(q);
  if (!usersSnapshot.empty) {
    usersSnapshot.forEach((user) => {
      userId = user.id;
    });
  }
  return userId;
}

export async function isExistUsernameFirebase(username) {
  const q = query(usersColRef, where("username", "==", username));
  const usersSnapshot = await getCountFromServer(q);

  return usersSnapshot.data().count > 0;
}

export async function isExistEmailFirebase(email) {
  const q = query(usersColRef, where("email", "==", email));
  const usersSnapshot = await getCountFromServer(q);

  return usersSnapshot.data().count > 0;
}
