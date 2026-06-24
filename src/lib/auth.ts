import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export function listenToUser(callback: (uid: string | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? user.uid : null);
  });
}