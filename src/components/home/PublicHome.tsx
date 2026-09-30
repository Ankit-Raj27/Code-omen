import React from "react";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import AuthModals from "@/components/Modals/AuthModals";
import { LandingPage } from "@/components/home/LandingPage";
import TrophySection from "@/components/home/TrophySection";
import Navbar from "@/components/navbar/Navbar";
import BlurFade from "@/components/ui/blur-fade";
import { Carousel } from "@/components/ui/carousel";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

const SLIDES = [
  { title: "NeetCode 150", button: "Code here!", src: "/neetcode150.jpg", redirectPath: "/problems/neetcode150" },
  { title: "Striver 150", button: "Code here!", src: "/striver150.png", redirectPath: "/problems/striver150" },
  { title: "GFG 100", button: "Code here!", src: "/gfg150.png", redirectPath: "/problems/gfg150" },
];

/** Signed-out home: the existing landing content (shared by / and /auth). */
const PublicHome: React.FC = () => {
  const authModal = useRecoilValue(authModalState);
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none bg-black min-h-screen text-white overflow-hidden">
        <section className="relative pt-20 pb-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10">
            <LandingPage />
            <div className="bg-black relative bottom-16">
              <BlurFade delay={0.3}>
                <NeonGradientCard
                  className="max-w-fit h-fit mx-auto"
                  borderSize={1}
                  neonColors={{ firstColor: "yellow , orange", secondColor: "blue, green" }}
                >
                  <Carousel slides={SLIDES} />
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

export default PublicHome;
