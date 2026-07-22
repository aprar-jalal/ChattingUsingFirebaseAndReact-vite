import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "../config/firebase-config";
export function subscribeToUserChats(
  uid,
  onSuccess,
  onError
) {

  const q = query(
    collection(db, "Chat"),
    // the chats for the user with this id only 
    where(
      "members",
      "array-contains",
      uid
    ),
    orderBy(
      "updatedAt",
      "desc"
    )
  );
  //for real time messaging 
  const unsubscribe = onSnapshot(
    q,
    (snapshot)=>{
      const chats = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
      }));
      onSuccess(chats);
    },
    (error)=>{
      onError(error);
    }
  );
  return unsubscribe;

}