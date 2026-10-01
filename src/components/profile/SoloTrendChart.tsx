import React from "react";
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { WeekActivity } from "@/lib/patternTrack/stats";

// Split from ProfileViews so recharts only loads with this chart.
const SOLO = "#0A84FF";
const axis = { stroke: "rgb(160,160,160)", fontSize: 11, tickLine: false, axisLine: false } as const;

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
              <ReferenceLine y={60} stroke="rgb(160,160,160)" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ stroke: "rgb(160,160,160)", strokeDasharray: "3 3" }}
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
