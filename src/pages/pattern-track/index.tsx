import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import TopBar from "@/components/TopBar/TopBar";
import useHasMounted from "@/components/hooks/useHasMounted";
import { authModalState } from "@/atoms/authModalAtom";
import { usePatternTrack, useToday } from "@/hooks/usePatternTrack";
import { setStartDate } from "@/lib/patternTrack/firestore";
import { currentWeek, patternForWeek } from "@/lib/patternTrack/stats";
import TodayView from "@/components/patternTrack/TodayView";
import RoadmapView from "@/components/patternTrack/RoadmapView";
import LogView from "@/components/patternTrack/LogView";
import MethodView from "@/components/patternTrack/MethodView";
import { Panel, btnPrimary } from "@/components/patternTrack/ui";

const TABS = [
  { id: "today", label: "Today" },
  { id: "roadmap", label: "Roadmap" },
  { id: "log", label: "Problem log" },
  { id: "method", label: "Method" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const isTab = (v: unknown): v is TabId => TABS.some((t) => t.id === v);

export default function PatternTrackPage() {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const today = useToday();
  const { user, logs, startDate, setStartDateState, loading, error } = usePatternTrack();
  const setAuthModal = useSetRecoilState(authModalState);

  const tab: TabId = isTab(router.query.tab) ? router.query.tab : user ? "today" : "roadmap";
  const goTo = (t: TabId) => router.replace({ query: { ...router.query, tab: t } }, undefined, { shallow: true });

  if (!hasMounted) return null;

  const week = currentWeek(startDate, today);
  const needsAuth = !user && (tab === "today" || tab === "log");

  const changeStart = async (d: string) => {
    if (!user) return;
    setStartDateState(d);
    try {
      await setStartDate(user.uid, d);
    } catch {
      toast.error("Couldn't save the start date.", { theme: "dark", position: "top-center" });
    }
  };

  return (
    <>
      <Head><title>Pattern Track · CodeOmen</title></Head>
      <main className="min-h-screen bg-dark-layer-2 pb-16">
        <TopBar />
        <div className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-dark-gray-8">Pattern Track</h1>
              <p className="text-sm text-dark-gray-6">
                {week > 0 ? `Week ${week} · ${patternForWeek(week)?.name}` : `Starts ${startDate}`}
              </p>
            </div>
          </header>

          <nav role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-dark-divider-border-2">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => goTo(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "border-dark-green-s text-dark-gray-8" : "border-transparent text-dark-gray-6 hover:text-dark-gray-8"
                }`}>
                {t.label}
              </button>
            ))}
          </nav>

          {error && (
            <Panel className="mb-4 text-sm text-dark-pink">Couldn&apos;t load your log. Refresh to retry.</Panel>
          )}

          {needsAuth ? (
            <Panel className="text-sm text-dark-label-2">
              <p>Sign in to track problems and revisions.</p>
              <Link href="/auth" className={`${btnPrimary} mt-3`}
                onClick={() => setAuthModal((s) => ({ ...s, isOpen: true, type: "login" }))}>
                Sign in
              </Link>
            </Panel>
          ) : loading && (tab === "today" || tab === "log") ? (
            <div className="animate-pulse space-y-2">
              {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-dark-layer-1" />)}
            </div>
          ) : (
            <div role="tabpanel">
              {tab === "today" && user && (
                <TodayView uid={user.uid} logs={logs} today={today} startDate={startDate}
                  onStartDateChange={changeStart} goTo={goTo} />
              )}
              {tab === "roadmap" && <RoadmapView logs={logs} currentWeek={week} />}
              {tab === "log" && user && (
                <LogView uid={user.uid} logs={logs} today={today} currentPatternId={patternForWeek(week)?.id} />
              )}
              {tab === "method" && <MethodView />}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
