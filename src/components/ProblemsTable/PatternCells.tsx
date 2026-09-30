import React from "react";
import Link from "next/link";
import { PATTERNS } from "@/content/patterns";
import { patternForListProblem, type ListProblemLike } from "@/lib/patternTrack/lists";
import { PatternChip } from "@/components/patternTrack/ui";

/** Table cell showing the problem's Pattern Track pattern (links to its sheet). */
export const PatternCell: React.FC<{ problem: ListProblemLike }> = ({ problem }) => {
  const p = patternForListProblem(problem);
  return (
    <td className="px-6 py-4">
      {p ? (
        <Link href={`/patterns/${p.id}`} className="hover:opacity-80"><PatternChip week={p.week} name={p.name} /></Link>
      ) : (
        <span className="text-dark-gray-6">—</span>
      )}
    </td>
  );
};

/** True when a row passes the pattern filter ("all" passes everything). */
export const matchesPattern = (problem: ListProblemLike, patternFilter = "all") =>
  patternFilter === "all" || patternForListProblem(problem)?.id === patternFilter;

/** Pattern filter select used above each list. */
export const PatternFilterSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-gray-400">
    Pattern
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-dark-blue-s"
    >
      <option value="all">All patterns</option>
      {PATTERNS.filter((p) => p.problems.length > 0).map((p) => (
        <option key={p.id} value={p.id}>{p.week}. {p.name}</option>
      ))}
    </select>
  </label>
);
