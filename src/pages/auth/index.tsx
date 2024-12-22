import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModals from "@/components/Modals/AuthModals";
import { SparklesCore } from "@/components/features/loading";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
  const authModal = useRecoilValue(authModalState);
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setPageLoading(true); 
      router.push("/"); 
    }
    if (!loading && !user) {
      setPageLoading(false); 
    }
  }, [user, router, loading]);

  if (pageLoading) return <SparklesCore />;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
          <Image src="/hero.png" width={600} height={100} alt="hero" />
        </div>
        {authModal.isOpen && <AuthModals />}
      </div>
    </div>
  );
};

export default AuthPage;
