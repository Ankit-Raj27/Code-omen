import React from "react";
import useHasMounted from "@/components/hooks/useHasMounted";
import PageLoader from "@/components/layout/PageLoader";
import PublicHome from "@/components/home/PublicHome";
import PageFrame from "@/components/layout/PageFrame";
import TodayView from "@/components/patternTrack/TodayView";
import { ErrorState, EmptyState } from "@/components/patternTrack/ui";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { weekLabel } from "@/lib/patternTrack/stats";

/** Home: Today for signed-in users, the landing page otherwise. */
export default function Home() {
  const hasMounted = useHasMounted();
  const { user, authLoading, logs, startDate, today, loading, error, retry } = usePatternTrack();

  if (!hasMounted || authLoading) return <PageLoader />;
  if (!user) return <PublicHome />;

  return (
    <PageFrame
      title={`Welcome back, ${user.displayName?.split(" ")[0] || "Coder"}!`}
      documentTitle="Today"
      subtitle={`${weekLabel(startDate, today)} · revise first, then learn.`}>
      {error ? (
        <ErrorState onRetry={retry} />
      ) : loading ? (
        <div className="animate-pulse space-y-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-900/50" />)}
        </div>
      ) : (
        <TodayView uid={user.uid} logs={logs} today={today} startDate={startDate} />
      )}
    </PageFrame>
  );
}
