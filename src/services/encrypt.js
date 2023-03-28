import CryptoJS from "crypto-js";

export function encryptData(data) {
  const md5Hash = CryptoJS.MD5(data).toString();
  return md5Hash;
}
