import React from "react";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import useHasMounted from "@/components/hooks/useHasMounted";
import PageFrame from "@/components/layout/PageFrame";
import { PatternDetail } from "@/components/patternTrack/PatternViews";
import { PATTERNS, PATTERN_BY_ID } from "@/content/patterns";
import { usePatternTrack } from "@/context/PatternTrackContext";

type Props = { id: string };

export default function PatternPage({ id }: Props) {
  const hasMounted = useHasMounted();
  const { user, logs } = usePatternTrack();
  const pattern = PATTERN_BY_ID[id];
  const i = PATTERNS.indexOf(pattern);
  const prev = PATTERNS[i - 1];
  const next = PATTERNS[i + 1];

  return (
    <PageFrame
      title={pattern.name}
      subtitle={pattern.id === "mixed-mocks" ? "Weeks 18–22" : `Week ${pattern.week}`}
      actions={
        <nav className="flex gap-3 text-sm">
          {prev && <Link href={`/patterns/${prev.id}`} className="text-dark-gray-6 hover:text-white">← {prev.name}</Link>}
          {next && <Link href={`/patterns/${next.id}`} className="text-dark-gray-6 hover:text-white">{next.name} →</Link>}
        </nav>
      }>
      <PatternDetail pattern={pattern} logs={hasMounted ? logs : []} signedIn={hasMounted && !!user} />
    </PageFrame>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PATTERNS.map((p) => ({ params: { id: p.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({
  props: { id: String(params?.id) },
});
