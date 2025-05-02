import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModals from "@/components/Modals/AuthModals";
import { SparklesCore } from "@/components/features/loading";
import { LandingPage } from "@/components/home/LandingPage";
import Navbar from "@/components/navbar/Navbar";
import BlurFade from "@/components/ui/blur-fade";
import { Carousel } from "@/components/ui/carousel";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import TrophySection from "@/components/home/TrophySection";


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
      title: "NeetCode 150",
      button: "Code here!",
      src: "/neetcode150.jpg",
      redirectPath: "problems/neetcode150",
    },
    {
      title: "Striver 150",
      button: "Code here!",
      src: "/striver150.png",
      redirectPath: "problems/striver150",
    },
    {
      title: "GFG 100",
      button: "Code here!",
      src: "/gfg150.png",
      redirectPath: "problems/gfg150",
    },

  ];

  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen text-white overflow-hidden">
        <section className="relative pt-20 pb-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10">
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
          </div>
        </section>

        <TrophySection />

      </main>
      {authModal.isOpen && <AuthModals />}
    </>
  );
};

export default AuthPage;
