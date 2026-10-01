import React, { useMemo } from "react";
import PageFrame from "@/components/layout/PageFrame";
import ProblemBrowser from "@/components/problems/ProblemBrowser";
import { allProblemRows } from "@/lib/problemList";

/** Every problem on the 18-week roadmap, plus the rest of CodeOmen's bank. */
export default function AllProblems() {
  const rows = useMemo(() => allProblemRows(), []);
  const here = rows.filter((r) => r.runsHere).length;
  return (
    <PageFrame title="Problems" subtitle={`${rows.length} problems along the Pattern Track. ${here} run here in JavaScript or Java.`}>
      <ProblemBrowser sheetHref="/problems" rows={rows} />
    </PageFrame>
  );
}
