import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModals from "@/components/Modals/AuthModals";
import { SparklesCore } from "@/components/features/loading";
import { LandingPage } from "@/components/home/LandingPage";
import Navbar from "@/components/navbar/Navbar";
import BlurFade from "@/components/ui/blur-fade";
import { Carousel } from "@/components/ui/carousel";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
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

  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      src: "/dashboard.png",
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: "/dashboard.png",
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: "/dashboard.png",
    },

  ];
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <LandingPage />

        <div className="bg-black relative bottom-16">
          <BlurFade delay={0.25 * 5}>
            <NeonGradientCard
              className="max-w-fit h-fit mx-auto"
              borderSize={1}
              neonColors={{
                firstColor: "yellow , orange",
                secondColor: "blue, green",
              }}
            >
              <Carousel slides={slideData} />
            </NeonGradientCard>
          </BlurFade>
        </div>

        <div>
          <p>sd,mds,m,sdm</p>
        </div>
        {authModal.isOpen && <AuthModals />}
      </main>
    </>
  );
};

export default AuthPage;
