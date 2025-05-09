import { auth, firestore } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

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
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email || !input.username || !input.password) {
      alert("Please fill all the forms!");
      return;
    }
    try {
      toast.loading("Creating your account", {
        position: "top-center",
        toastId: "loadingToast",
      });
      const newUser = await createUserWithEmailAndPassword(
        input.email,
        input.password
      );
      if (!newUser) return;

      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: input.username,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      };

      await setDoc(doc(firestore, "users", newUser.user.uid), userData);
      router.push("/");
    } catch (error: any) {
      console.error("Error during email registration:", error);
      toast.error(error.message, { position: "top-center" });
    } finally {
      toast.dismiss("loadingToast");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const googleSignIn = await signInWithGoogle();
      if (!googleSignIn) return;

      const userDocRef = doc(firestore, "users", googleSignIn.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const userData = {
          uid: googleSignIn.user.uid,
          email: googleSignIn.user.email,
          displayName: googleSignIn.user.displayName || "Anonymous",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          likedProblems: [],
          dislikedProblems: [],
          solvedProblems: [],
          starredProblems: [],
        };
        await setDoc(userDocRef, userData);
      }
      router.push("/");
    } catch (error) {
      console.error("Error during Google sign-up:", error);
      toast.error("Google sign-up failed!", { position: "top-center" });
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error during email registration:", error);
      toast.error("User already exists!", { position: "top-center" });
    }
    if (googleError) {
      console.error( googleError);
      toast.error("Google sign-up error!", { position: "top-center" });
    }
  }, [error, googleError]);

  return (
    <form className="space-y-6 px-6 py-4" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white">Register now!</h3>
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
          placeholder="name@company.com"
        />
      </div>
      <div>
        <label
          htmlFor="username"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Username
        </label>
        <input
          onChange={handleChangeInput}
          type="text"
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
        className="w-full text-black focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
      bg-brand-orange hover:bg-brand-orange-s"
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full text-black focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        bg-white hover:bg-gray-400 mt-2"
      >
        {googleLoading ? "Loading..." : "Sign up with Google"}
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
