import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModal = useSetRecoilState(authModalState);
  const handleClick = (type: "login" | "register" | "forgotPassword") => {
    setAuthModal((prev) => ({ ...prev, type }));
  };

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      return alert("Please fill all fields!");
    }
    try {
      const newUser = await signInWithEmailAndPassword(input.email, input.password);
      if (!newUser) {return};
      router.push("/");
    } catch (error: any) {
      toast.error("Login error, check details!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleSignIn = await signInWithGoogle();
      if (googleSignIn) {
        router.push("/");
      }
    } catch (error) {
      toast.error("Google login failed!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Wrong username or password", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
    if (googleError) {
      toast.error("Google login error", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  }, [error, googleError]);

  return (
    <form className="space-y-6 px-6 py-4" onSubmit={handleLogin}>
      <h3 className="text-xl font-medium text-white">Sign in</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Your email
        </label>
        <input
          onChange={handleInputChange}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-600 
            block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@comapny.com"
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
          onChange={handleInputChange}
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
        className="w-full text-black focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        bg-brand-orange hover:bg-gray-600"
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full text-black focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        bg-gray-200 hover:bg-gray-600 mt-2"
      >
        {googleLoading ? "Loading..." : "Sign in with Google"}
      </button>
      <button className="flex w-full justify-end ">
        <a
          href="#"
          className="text-sm block text-brand-orange hover:underline w-full text-right"
          onClick={() => handleClick("forgotPassword")}
        >
          Forgot Password?
        </a>
      </button>
      <div className="text-sm font-medium text-gray-300 ">
        Not Registered?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleClick("register")}
        >
          create Account!
        </a>
      </div>
    </form>
  );
};

export default Login;
