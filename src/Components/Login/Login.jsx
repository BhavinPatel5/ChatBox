import React, { useState } from "react";
import User1 from "../../Assets/pngegg.png";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account Created successfully,You can login now");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex w-full items-center p-5 justify-center flex-col md:flex-row ">
      <div className="flex flex-[1]  sm:pb-3 sml:pb-0 justify-center border-b  border-b-gray-600 md:border-r md:border-r-gray-600 md:border-b-transparent">
        <form
          onSubmit={handleLogin}
          className="w-[230px] justify-center flex flex-col gap-3 items-center">
          <h2 className="font-bold text-2xl md:3xl">Welcome Back,</h2>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="on"
            className="p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="border-gray-600 border rounded-xl w-full bg-blue-500 bg-opacity-75 p-2 cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed">
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
      <div className="flex flex-[1] justify-center w-full">
        <form
          onSubmit={handleRegister}
          className="w-[300px] justify-center flex flex-col gap-3  items-center pt-2 md:pt-0">
          <h2 className="font-bold text-2xl md:3xl">Create an Account</h2>
          <div className="flex gap-3 items-center">
            <img
              src={avatar.url || User1}
              alt=""
              className="w-10 h-10 md:w-5 md:h-5 mdx:w-10 mdx:h-10 rounded-[50%] object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              className="hidden"
              id="file"
            />
            <label htmlFor="file" className="cursor-pointer">
              Upload an Image
            </label>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="p-2 md:p-1 mdx:p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="p-2 md:p-1 mdx:p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="on"
            className="p-2 md:p-1 mdx:p-2 bg-transblue border-gray-600 border rounded-md bg-opacity-25 focus:outline-none text-white placeholder:text-white"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="border-gray-600 border rounded-xl w-[235px] mdx:w-[235px] md:w-[225px] bg-blue-500 bg-opacity-75 p-2 md:p-1 mdx:p-2 cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed">
            {loading ? "Loading" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
