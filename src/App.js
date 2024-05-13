import { useEffect } from "react";
import Chat from "./Components/Chat";
import Detail from "./Components/Detail";
import List from "./Components/List";
import Login from "./Components/Login/Login";
import Notification from "./Components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStrore";
import { useChatStore } from "./lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="bg-gradient-to-b from-gray-200 via-blue-500 to-stone-100 w-screen h-screen justify-center items-center flex ">
        <div className="h-[90vh] w-[90vw] mx-auto bg-[#5a5a5a57] bg-opacity-75 backdrop-blur-[50px] saturate-[180%] border border-opacity-10 rounded-3xl flex text-white items-center justify-center text-8xl overflow-x-auto">
          Loading
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-200 via-blue-500 to-stone-100 w-screen h-screen justify-center items-center flex ">
      <div className="h-[90vh] w-[90vw] overflow-x-auto mx-auto bg-[#5a5a5a57] bg-opacity-75 backdrop-blur-[150px] saturate-[180%] border border-opacity-20 rounded-2xl flex text-white">
        {currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (
          <Login />
        )}
        <Notification />
      </div>
    </div>
  );
}

export default App;
