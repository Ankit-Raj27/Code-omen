import React from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { WeekActivity } from "@/lib/patternTrack/stats";

// Validated for the dark surface (dataviz validator: lightness, chroma, CVD, contrast all pass).
const NEW = "#0A84FF"; // new problems
const REVIEW = "#25A150"; // reviews
const INK = "rgba(239,241,246,0.75)";
const MUTED = "rgb(138,138,138)";
const GRID = "rgba(255,255,255,0.06)";

const axis = { stroke: MUTED, fontSize: 11, tickLine: false, axisLine: false } as const;

const TooltipBox: React.FC<{ active?: boolean; label?: string; payload?: { name: string; value: number | null; color: string }[]; unit?: string }> = ({
  active, label, payload, unit = "",
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950/95 px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 text-gray-400">Week of {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2" style={{ color: INK }}>
          <span className="h-2 w-2 rounded-sm" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-white">{p.value === null ? "no reviews" : `${p.value}${unit}`}</span>
        </div>
      ))}
    </div>
  );
};

/** New problems vs reviews per week (grouped bars) + recall rate per week (line). */
const TrackCharts: React.FC<{ weeks: WeekActivity[] }> = ({ weeks }) => {
  const anyActivity = weeks.some((w) => w.logged || w.reviews);
  const anyReviews = weeks.some((w) => w.reviews);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <figure className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <figcaption className="mb-2">
          <div className="text-sm font-medium text-white">Weekly activity</div>
          <div className="text-xs text-gray-400">New problems and reviews, last {weeks.length} weeks</div>
        </figcaption>
        {anyActivity ? (
          <div className="h-48" role="img" aria-label="Bar chart of new problems and reviews per week">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeks} barGap={2} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" {...axis} interval={1} />
                <YAxis allowDecimals={false} {...axis} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} content={<TooltipBox />} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }}
                  formatter={(value: string) => <span style={{ color: INK }}>{value}</span>} />
                <Bar dataKey="logged" name="New problems" fill={NEW} radius={[4, 4, 0, 0]} maxBarSize={14} isAnimationActive={false} />
                <Bar dataKey="reviews" name="Reviews" fill={REVIEW} radius={[4, 4, 0, 0]} maxBarSize={14} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="flex h-48 items-center justify-center text-sm text-gray-400">Your weekly activity shows up here once you log problems.</p>
        )}
      </figure>

      <figure className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <figcaption className="mb-2">
          <div className="text-sm font-medium text-white">Recall rate</div>
          <div className="text-xs text-gray-400">Share of reviews graded Clean, per week</div>
        </figcaption>
        {anyReviews ? (
          <div className="h-48" role="img" aria-label="Line chart of the weekly share of reviews graded clean">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeks} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" {...axis} interval={1} />
                <YAxis domain={[0, 100]} ticks={[0, 50, 100]} unit="%" {...axis} />
                <Tooltip cursor={{ stroke: MUTED, strokeDasharray: "3 3" }} content={<TooltipBox unit="%" />} />
                <Line type="monotone" dataKey="recallPct" name="Recall" stroke={REVIEW} strokeWidth={2}
                  dot={{ r: 4, fill: REVIEW, stroke: "#111", strokeWidth: 2 }} activeDot={{ r: 5 }} connectNulls isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="flex h-48 items-center justify-center text-sm text-gray-400">Recall appears after your first graded review.</p>
        )}
      </figure>

      {/* Table view of the same data for screen readers. */}
      <table className="sr-only">
        <caption>Weekly activity and recall</caption>
        <thead><tr><th>Week of</th><th>New problems</th><th>Reviews</th><th>Recall</th></tr></thead>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.weekStart}><td>{w.label}</td><td>{w.logged}</td><td>{w.reviews}</td><td>{w.recallPct ?? "—"}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackCharts;
