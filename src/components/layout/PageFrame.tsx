import React from "react";
import Head from "next/head";
import TopBar from "@/components/TopBar/TopBar";

type Props = {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/** Standard page: top bar, then a 1200px column with title, subtitle and content. */
const PageFrame: React.FC<Props> = ({ title, subtitle, actions, children }) => (
  <>
    <Head><title>{`${title} · CodeOmen`}</title></Head>
    <div className="min-h-screen bg-dark-layer-2 pb-16">
      <TopBar />
      <main className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-dark-gray-8">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-dark-gray-6">{subtitle}</p>}
          </div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  </>
);

export default PageFrame;
