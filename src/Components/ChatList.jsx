import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddUser from "./addUser/AddUser";
import user1 from "../Assets/pngegg.png";

import { useUserStore } from "../lib/userStrore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return {
            ...item,
            user,
          };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.toSorted((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef, { chats: userChats });
      changeChat(chat.chatId, chat.user);
    } catch (err) {}
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div className="w-full h-max flex flex-col items-start gap-5 p-5 ">
      <div className="w-full flex gap-2 items-center">
        <div className="w-full flex items-center bg-transblue border rounded-md bg-opacity-50 gap-2">
          <SearchIcon className="w-5 h-5 pl-1" />
          <input
            type="text"
            placeholder="Search"
            className=" flex bg-transparent w-full "
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {addMode ? (
          <RemoveIcon
            onClick={() => setAddMode((prev) => !prev)}
            className="w-5 h-5 bg-transblue bg-opacity-50 border rounded-md cursor-pointer"
          />
        ) : (
          <AddIcon
            onClick={() => setAddMode((prev) => !prev)}
            className="w-5 h-5 bg-transblue bg-opacity-50 border rounded-md cursor-pointer"
          />
        )}
      </div>
      <div className="w-full h-[70vh] flex flex-col gap-5 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.chatId}
            className="w-full flex items-center gap-2 pb-2 border-b border-gray-600"
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}>
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? user1
                  : chat.user.avatar || user1
              }
              className="w-11 h-11 rounded-[50%] object-cover"
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-semibold">
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p className="text-xs">{chat.lastmessage}</p>
            </div>
          </div>
        ))}
      </div>
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
