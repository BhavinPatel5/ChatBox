import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VideocamIcon from "@mui/icons-material/Videocam";
import EditIcon from "@mui/icons-material/Edit";
import user1 from "../Assets/pngegg.png";
import { useUserStore } from "../lib/userStrore";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="w-[330px] md:w-auto">
      <div className="p-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            className="w-[50px] h-[50px] object-contain rounded-[50%]"
            src={currentUser.avatar || user1}
            alt="dp"
          />
          <h2 className="font-semibold text-xl">{currentUser.username}</h2>
        </div>
        <div className="gap-2 flex ">
          <MoreHorizIcon className="w-5 h-5 cursor-pointer" />
          <VideocamIcon className="w-5 h-5 cursor-pointer" />
          <EditIcon className="w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
