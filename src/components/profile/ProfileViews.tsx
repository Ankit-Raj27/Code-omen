import React from "react";
import Link from "next/link";
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PATTERNS } from "@/content/patterns";
import { activityLevel, patternProgress, type DayActivity, type LogEntry, type WeekActivity } from "@/lib/patternTrack/stats";
import { Bar } from "@/components/patternTrack/ui";

// Sequential ramp: one green hue, lighter → stronger with more activity (validated
// base colour for the dark surface; levels are opacity steps of it).
const LEVEL_BG = [
  "rgba(255,255,255,0.06)",
  "rgba(37,161,80,0.30)",
  "rgba(37,161,80,0.55)",
  "rgba(37,161,80,0.80)",
  "rgba(37,161,80,1)",
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (ymd: string) => `${Number(ymd.slice(8))} ${MONTHS[Number(ymd.slice(5, 7)) - 1]}`;

/** GitHub-style heatmap: one column per week (Mon at top), one small square per day, month labels above. */
export const ActivityHeatmap: React.FC<{ days: DayActivity[]; today: string }> = ({ days, today }) => {
  const scroller = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    // Start scrolled to the most recent weeks on narrow screens.
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, []);
  const weeks: DayActivity[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const total = days.reduce((s, d) => s + d.logged + d.reviews, 0);
  const activeDays = days.filter((d) => d.logged + d.reviews > 0).length;
  // Month label over the first week column that starts in a new month.
  // Skip a label that would sit within 3 columns of the previous one (they'd overlap).
  let lastLabel = -10;
  const monthAt = weeks.map((w, i) => {
    const m = w[0].date.slice(5, 7);
    const starts = i === 0 || m !== weeks[i - 1][0].date.slice(5, 7);
    if (!starts || i - lastLabel < 3) return "";
    lastLabel = i;
    return MONTHS[Number(m) - 1];
  });

  return (
    <figure className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm text-gray-300">
          <span className="font-medium text-white">{total}</span> problems + reviews on{" "}
          <span className="font-medium text-white">{activeDays}</span> days · last {weeks.length} weeks
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400" aria-hidden="true">
          Less {LEVEL_BG.map((bg) => <span key={bg} className="h-3 w-3 rounded-sm" style={{ background: bg }} />)} More
        </div>
      </figcaption>
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-full flex-col gap-1" role="img"
          aria-label={`Activity heatmap: ${total} problems and reviews over ${activeDays} active days`}>
          <div className="flex gap-1 text-[10px] leading-none text-gray-500" aria-hidden="true">
            {monthAt.map((m, i) => <span key={weeks[i][0].date} className="w-4 shrink-0 overflow-visible whitespace-nowrap">{m}</span>)}
          </div>
          <div className="flex gap-1">
            {weeks.map((w) => (
              <div key={w[0].date} className="flex flex-col gap-1">
                {w.map((d) => {
                  const n = d.logged + d.reviews;
                  const future = d.date > today;
                  return (
                    <span
                      key={d.date}
                      title={future ? undefined : `${fmtDay(d.date)}: ${d.logged} new, ${d.reviews} review${d.reviews === 1 ? "" : "s"}`}
                      className={`h-4 w-4 shrink-0 rounded-[3px] ${d.date === today ? "ring-1 ring-white/60" : ""}`}
                      style={{ background: future ? "transparent" : LEVEL_BG[activityLevel(n)] }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
};

/** 18 tiles, one per pattern: how much of it you've logged and mastered. */
export const MasteryGrid: React.FC<{ logs: LogEntry[]; currentWeek: number }> = ({ logs, currentWeek }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
    {PATTERNS.map((p) => {
      const pr = patternProgress(p, logs);
      const current = p.week === Math.min(currentWeek, 18);
      const mine = logs.filter((l) => l.patternId === p.id).length;
      return (
        <Link key={p.id} href={`/patterns/${p.id}`}
          className={`rounded-xl border bg-gray-900/50 p-3 transition-colors hover:bg-gray-800/60 ${current ? "border-dark-green-s/60" : "border-gray-800"}`}>
          <div className="text-[11px] text-gray-400">{p.id === "mixed-mocks" ? "Wk 18–22" : `Week ${p.week}`}</div>
          <div className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-white">{p.name}</div>
          {pr.total > 0 ? (
            <>
              <div className="mt-2"><Bar value={pr.logged} total={pr.total} /></div>
              <div className="mt-1 text-[11px] text-gray-400">{pr.logged}/{pr.total} · {pr.mastered} mastered</div>
            </>
          ) : (
            <div className="mt-2 text-[11px] text-gray-400">{mine} logged</div>
          )}
        </Link>
      );
    })}
  </div>
);

const SOLO = "#0A84FF";
const axis = { stroke: "rgb(138,138,138)", fontSize: 11, tickLine: false, axisLine: false } as const;

/** Weekly share of mediums solved without help, against the 60% goal. */
export const SoloTrendChart: React.FC<{ weeks: WeekActivity[] }> = ({ weeks }) => {
  const any = weeks.some((w) => w.mediums > 0);
  return (
    <figure className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <figcaption className="mb-2">
        <div className="text-sm font-medium text-white">Mediums solved solo</div>
        <div className="text-xs text-gray-400">Per week; dashed line is the 60% goal for week 10</div>
      </figcaption>
      {any ? (
        <div className="h-48" role="img" aria-label="Line chart of the weekly share of medium problems solved solo">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeks} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" {...axis} interval={1} />
              <YAxis domain={[0, 100]} ticks={[0, 60, 100]} unit="%" {...axis} />
              <ReferenceLine y={60} stroke="rgb(138,138,138)" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ stroke: "rgb(138,138,138)", strokeDasharray: "3 3" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const w = payload[0].payload as WeekActivity;
                  return (
                    <div className="rounded-lg border border-gray-800 bg-gray-950/95 px-3 py-2 text-xs text-gray-300 shadow-lg">
                      <div className="mb-1 text-gray-400">Week of {label}</div>
                      {w.mediums ? `${w.mediumsSolo} of ${w.mediums} mediums solo (${w.mediumSoloPct}%)` : "No mediums"}
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="mediumSoloPct" name="Solo" stroke={SOLO} strokeWidth={2} connectNulls
                dot={{ r: 4, fill: SOLO, stroke: "#111", strokeWidth: 2 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="flex h-48 items-center justify-center text-sm text-gray-400">Log a medium problem to start this trend.</p>
      )}
      <table className="sr-only">
        <caption>Mediums solved solo per week</caption>
        <thead><tr><th>Week of</th><th>Mediums</th><th>Solo</th></tr></thead>
        <tbody>{weeks.map((w) => <tr key={w.weekStart}><td>{w.label}</td><td>{w.mediums}</td><td>{w.mediumsSolo}</td></tr>)}</tbody>
      </table>
    </figure>
  );
};
