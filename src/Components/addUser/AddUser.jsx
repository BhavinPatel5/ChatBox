import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../lib/firebase";
import user1 from "../../Assets/pngegg.png";
import { useUserStore } from "../../lib/userStrore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const useRef = collection(db, "users");
      const q = query(useRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {}
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatRef,user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(doc(userChatRef,currentUser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:user.id,
          updatedAt: Date.now(),
        })
      })
      console.log(newChatRef.id);
    } catch (err) {}
  };

  return (
    <div className="absolute top-[17%] left-[3%] h-max w-max bg-gray-800 bg-opacity-75 rounded-xl flex flex-col justify-between p-3 gap-6">
      <form className="flex p-2 gap-2" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="username"
          name="username"
          className="p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
        />
        <button className="border-gray-600 border rounded-xl bg-blue-500 bg-opacity-75 p-2 cursor-pointer">
          Search
        </button>
      </form>
      {user && (
        <div className="flex items-center flex-col gap-5 w-full">
          <div className="flex items-center gap-5 justify-around w-full">
            <img
              className="w-10 h-10 object-contain"
              src={user.avatar || user1}
              alt=""
            />
            <h2>{user.username}</h2>
            <button
              onClick={handleAdd}
              className="border-gray-600 border rounded-xl bg-blue-500 bg-opacity-75 p-2 cursor-pointer">
              Add User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
