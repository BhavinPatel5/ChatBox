import React from "react";
import user1 from "../Assets/pngegg.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DownloadIcon from "@mui/icons-material/Download";
import demopic from "../Assets/Screenshot from 2024-04-16 09-30-22.png";
import { auth, db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStrore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {}
  };

  return (
    <div className="flex flex-[1] flex-col justify-center">
      {/*top*/}
      <div className="flex flex-col h-[15vh] items-center p-5 border-b border-gray-600">
        <img
          src={user?.avatar || user1}
          alt=""
          className="justify-center w-[60px] h-[60px] flex rounded-[50%]"
        />
        <h2 className="font-semibold">{user?.username}</h2>
        <p className="text-sm">lorem insup inadajlad kj fas fdshfk sh</p>
      </div>
      {/*bottom*/}
      <div className="w-full h-[60vh] p-4">
        <div className="p-2 flex justify-between">
          <h3 className="font-bold">Chat setting</h3>
          <ArrowDropDownIcon />
        </div>
        <div className="p-2 flex justify-between">
          <h3 className="font-bold">Chat setting</h3>
          <ArrowDropUpIcon />
        </div>
        <div className="p-2 flex justify-between">
          <h3 className="font-bold">Privacy & Help</h3>
          <ArrowDropDownIcon />
        </div>
        <div className="overflow-y-auto h-[43vh]">
          {/*photo*/}
          <div className="p-2 flex justify-between">
            <h3 className="font-bold">Shared Photos</h3>
            <ArrowDropDownIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.png</p>
            </div>
            <DownloadIcon />
          </div>
          {/*file*/}
          <div className="p-2 flex justify-between">
            <h3 className="font-bold">Shared Files</h3>
            <ArrowDropDownIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
          <div className="flex p-2 justify-between items-center">
            <div className="flex items-center gap-5">
              <img src={demopic} alt="" className="w-10 h-10" />
              <p>xyz.pdf</p>
            </div>
            <DownloadIcon />
          </div>
        </div>
      </div>
      <div className="w-full justify-center flex mb-8 flex-col gap-2 items-center">
        <button
          onClick={handleBlock}
          className="w-[70%] h-8 bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:bg-gradient-to-br shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 opacity-30 hover:opacity-100 rounded-md">
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button
          onClick={() => auth.signOut()}
          className="w-[70%] h-8 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 hover:bg-gradient-to-br shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 opacity-30 hover:opacity-100 rounded-md">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
