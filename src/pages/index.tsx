import React from "react";
import { toast } from "react-toastify";
import useHasMounted from "@/components/hooks/useHasMounted";
import { SparklesCore } from "@/components/features/SparkleCore";
import PublicHome from "@/components/home/PublicHome";
import PageFrame from "@/components/layout/PageFrame";
import TodayView from "@/components/patternTrack/TodayView";
import { EmptyState } from "@/components/patternTrack/ui";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { setStartDate } from "@/lib/patternTrack/firestore";
import { weekLabel } from "@/lib/patternTrack/stats";

/** Home: Today for signed-in users, the landing page otherwise. */
export default function Home() {
  const hasMounted = useHasMounted();
  const { user, authLoading, logs, startDate, setStartDateState, today, loading, error } = usePatternTrack();

  if (!hasMounted || authLoading) return <SparklesCore />;
  if (!user) return <PublicHome />;

  const changeStart = async (d: string) => {
    setStartDateState(d);
    try {
      await setStartDate(user.uid, d);
    } catch {
      toast.error("Couldn't save the start date.", { theme: "dark", position: "top-center" });
    }
  };

  return (
    <PageFrame
      title={`Welcome back, ${user.displayName?.split(" ")[0] || "Coder"}!`}
      documentTitle="Today"
      subtitle={`${weekLabel(startDate, today)} · revise first, then learn.`}>
      {error ? (
        <EmptyState>Couldn&apos;t load your log. Refresh to retry.</EmptyState>
      ) : loading ? (
        <div className="animate-pulse space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-900/50" />)}
        </div>
      ) : (
        <TodayView uid={user.uid} logs={logs} today={today} startDate={startDate} onStartDateChange={changeStart} />
      )}
    </PageFrame>
  );
}
