import React, { useMemo } from "react";
import PageFrame from "@/components/layout/PageFrame";
import { sheetRows } from "@/lib/problemList";
import ProblemBrowser from "./ProblemBrowser";
import { useSheetDocs } from "./hooks";

/** A published sheet (NeetCode / Striver / GFG): its Firestore list in the shared browser. */
const SheetPage: React.FC<{ collection: string; href: string; title: string; subtitle: string }> = ({ collection, href, title, subtitle }) => {
  const { docs, loading, error, retry } = useSheetDocs(collection);
  const rows = useMemo(() => sheetRows(docs), [docs]);
  return (
    <PageFrame title={title} subtitle={subtitle}>
      <ProblemBrowser sheetHref={href} rows={rows} loading={loading} error={error} onRetry={retry} />
    </PageFrame>
  );
};

export default SheetPage;
