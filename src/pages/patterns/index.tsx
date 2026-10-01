import React from "react";
import Link from "next/link";
import useHasMounted from "@/components/hooks/useHasMounted";
import PageFrame from "@/components/layout/PageFrame";
import { PatternList } from "@/components/patternTrack/PatternViews";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { currentWeek } from "@/lib/patternTrack/stats";

export default function PatternsPage() {
  const hasMounted = useHasMounted();
  const { logs, startDate, today } = usePatternTrack();
  if (!hasMounted) return null;
  return (
    <PageFrame
      title="Patterns"
      subtitle="18 weekly patterns, in order. Week 18 runs mixed mocks through week 22."
      actions={<Link href="/method" className="inline-flex min-h-[32px] items-center rounded px-2 hover:bg-dark-fill-3 text-sm text-dark-blue-s">How to study →</Link>}>
      <PatternList logs={logs} currentWeek={currentWeek(startDate, today)} />
    </PageFrame>
  );
}
