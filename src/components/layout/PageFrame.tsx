import React from "react";
import Head from "next/head";
import { motion, useReducedMotion } from "framer-motion";
import TopBar from "@/components/TopBar/TopBar";
import AppBackground from "./AppBackground";

type Props = {
  title: React.ReactNode;
  /** Plain-text title for the browser tab when `title` isn't a string. */
  documentTitle?: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/** Standard page: top bar, glow background, a 1200px column with title and content. */
const PageFrame: React.FC<Props> = ({ title, documentTitle, subtitle, actions, children }) => {
  const reduce = useReducedMotion();
  const tab = documentTitle ?? (typeof title === "string" ? title : "CodeOmen");
  return (
    <>
      <Head><title>{`${tab} · CodeOmen`}</title></Head>
      <div className="relative min-h-screen bg-black pb-20 text-white">
        <AppBackground />
        <TopBar />
        <main id="main" tabIndex={-1} className="relative mx-auto outline-none max-w-[1200px] px-4 pt-10 sm:px-6">
          <motion.header
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-wrap items-end justify-between gap-3"
          >
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
            </div>
            {actions}
          </motion.header>
          {children}
        </main>
      </div>
    </>
  );
};

export default PageFrame;
