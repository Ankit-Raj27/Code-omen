import React from "react";
import { useRouter } from "next/router";
import useHasMounted from "@/components/hooks/useHasMounted";
import PageFrame from "@/components/layout/PageFrame";
import LogView from "@/components/patternTrack/LogView";
import RequireSignIn from "@/components/patternTrack/RequireSignIn";
import { ErrorState, EmptyState } from "@/components/patternTrack/ui";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { prefillForLc } from "@/lib/patternTrack/bank";
import { currentWeek, patternForWeek } from "@/lib/patternTrack/stats";

export default function LogPage() {
  const hasMounted = useHasMounted();
  const { query } = useRouter();
  const { user, authLoading, logs, startDate, today, loading, error, retry } = usePatternTrack();
  const prefill = typeof query.slug === "string" ? prefillForLc(query.slug) : undefined;

  return (
    <PageFrame title="Problem log" subtitle="Every problem you solve, with the one-line insight you'll recall later.">
      {!hasMounted || authLoading ? null : !user ? (
        <RequireSignIn what="log problems and schedule reviews" />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-gray-900/50" />
      ) : (
        <LogView uid={user.uid} logs={logs} today={today} prefill={prefill}
          currentPatternId={patternForWeek(currentWeek(startDate, today))?.id} />
      )}
    </PageFrame>
  );
}
