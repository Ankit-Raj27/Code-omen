import { auth } from "@/Firebase/firebase";
import { useRouter } from "next/navigation";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
  const router = useRouter();
  const [signOut, loading, error] = useSignOut(auth);
    const handleClick = () => {
      signOut();
      router.push("/auth");

    }
    
    
  return (
    <button className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange " onClick={handleClick} >
      <FiLogOut />
    </button>
  );
};
export default Logout;
