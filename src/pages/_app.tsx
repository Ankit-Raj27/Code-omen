import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from "recoil";
import { PatternTrackProvider } from "@/context/PatternTrackContext";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import OfflineBanner from "@/components/layout/OfflineBanner";

export default function App({ Component, pageProps }: AppProps) {
  return(

    <RecoilRoot>
      <Head>
        <title>CodeOmen</title>
        <meta name="description" content="CodeOmen: learn DSA one pattern a week, solve in JavaScript or Java, and revise with spaced repetition." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <ToastContainer />
      <OfflineBanner />
      <PatternTrackProvider>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </PatternTrackProvider>
    </RecoilRoot>
  )
}