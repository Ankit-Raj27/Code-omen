import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModal = useSetRecoilState(authModalState);
  const handleClick = () => {
    setAuthModal((prev) => ({ ...prev, type: "login" }));
  };

  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
  });
  const router = useRouter();
  
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email || !input.username || !input.password)
      return alert("Please fill all the forms!");
    try {
      const newUser = await createUserWithEmailAndPassword(
        input.email,
        input.password
      );
      if (!newUser) {
        return;
      }
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };
  useEffect(() => {
    if (error) {
      alert("User already exists!");
    }
  }, [error]);

  return (
    <form className="space-y-6 px-6 py-4" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white"> Register now!</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 
          block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@comapny.com"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Username
        </label>
        <input
          onChange={handleChangeInput}
          type="username"
          name="username"
          id="username"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 
          block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="Abcd"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 
          block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="*********"
        />
      </div>
      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
      bg-brand-orange hover:bg-brand-orange-s"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="text-sm font-medium text-gray-300 ">
        Already Registered?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={handleClick}
        >
          Log In
        </a>
      </div>
    </form>
  );
};
export default Signup;
