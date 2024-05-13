import React, { useEffect, useRef, useState } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import ImageIcon from "@mui/icons-material/Image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MicIcon from "@mui/icons-material/Mic";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import user1 from "../Assets/pngegg.png";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStrore";
import upload from "../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [msg, setMsg] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const endRef = useRef(null);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setMsg((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg({
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };
  const handleSend = async () => {
    if (msg === "") return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          msg,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastmessage = msg;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: "",
    });
    setMsg("");
  };
  return (
    <div className="w-[300px] md:w-full flex flex-[2] flex-col border-l border-r border-gray-600">
      {/*Top */}
      <div className="w-full h-[10vh] flex items-center justify-between p-5 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || user1}
            alt=""
            className="justify-center w-[45px] h-[45px] flex rounded-[50%]"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-sm">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CallIcon className="w-5 h-5 cursor-pointer" />
          <VideocamIcon className="w-5 h-5 cursor-pointer" />
          <InfoIcon className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/*Mid*/}
      <div className="flex h-[70vh] flex-col gap-[2px] overflow-auto">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id
                ? "flex items-end gap-1 p-5 justify-end w-full flex-col"
                : "flex items-start gap-1 p-5 justify-start w-full flex-col"
            }
            key={message?.createAt}>
            {message.img && (
              <img
                src={message.img}
                alt=""
                className="object-cover w-[400px] border-black border-2"
              />
            )}
            <div className="flex flex-col  ">
              <p
                className={
                  message.senderId === currentUser?.id
                    ? "ownMessage"
                    : "otherMessage"
                }>
                {message.msg}
              </p>
              <p
                className={
                  message.senderId === currentUser?.id
                    ? "senderside text-xs pl-1"
                    : "receiverside text-xs pl-1"
                }>
                1 Min Ago
              </p>
            </div>
          </div>
        ))}
        {img.url && (
          <div>
            <div>
              <img src={img.url} alt="" className="object-cover w-[300px]" />
            </div>
          </div>
        )}
      </div>
      <div ref={endRef}></div>
      {/*Bottom */}
      <div className="flex flex-col">
        <div className="flex-end absolute top-1/3 left-1/2 ">
          <EmojiPicker open={open} onEmojiClick={handleEmoji} />
        </div>
        <div className="flex h-[10vh] items-center w-full p-5 gap-3">
          <div className="flex gap-3 items-end justify-center">
            <label htmlFor="file">
              <ImageIcon />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImg}
              className="hidden"
              id="file"
            />
            <CameraAltIcon />
            <MicIcon />
          </div>
          <div className="w-full bg-transblue border rounded-md bg-opacity-50">
            <input
              className="w-full flex bg-transparent p-1 disabled:cursor-not-allowed"
              type="text"
              placeholder={isCurrentUserBlocked || isReceiverBlocked?"You cannot send messsages":"Type a Message"}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
          </div>
          <div className="flex gap-3">
            <InsertEmoticonIcon onClick={() => setOpen((prev) => !prev)} />

            <SendIcon
              onClick={handleSend}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
