import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PATTERNS, PATTERN_BY_ID } from "@/content/patterns";
import { deleteLog } from "@/lib/patternTrack/firestore";
import { isMastered, isOverdue } from "@/lib/patternTrack/srs";
import { filterLogs, logsToCsv, sortNewestFirst, type LogEntry, type LogFilter } from "@/lib/patternTrack/stats";
import { safeHttpUrl, type Ymd } from "@/lib/patternTrack/dates";
import LogForm from "./LogForm";
import type { LogPrefill } from "@/lib/patternTrack/bank";
import { DifficultyChip, Panel, StageDots, btnGhost, inputCls } from "./ui";

/** Two-click delete: first click arms, second confirms. Auto-disarms after 3s. */
const DeleteButton: React.FC<{ onConfirm: () => Promise<void> }> = ({ onConfirm }) => {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      onClick={() => (armed ? onConfirm() : setArmed(true))}
      className={`rounded px-2 py-1 text-xs ${armed ? "bg-dark-pink text-white" : "text-dark-gray-6 hover:text-dark-pink"}`}
      aria-label={armed ? "Confirm delete" : "Delete"}
    >
      {armed ? "Confirm?" : "Delete"}
    </button>
  );
};

function downloadCsv(logs: LogEntry[], today: Ymd) {
  const blob = new Blob(["﻿" + logsToCsv(logs)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pattern-log-${today}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

const LogView: React.FC<{
  uid: string;
  logs: LogEntry[];
  today: Ymd;
  currentPatternId?: string;
  prefill?: LogPrefill;
}> = ({ uid, logs, today, currentPatternId, prefill }) => {
  const [filter, setFilter] = useState<LogFilter>({ patternId: "", solo: "all", text: "" });
  const rows = useMemo(() => sortNewestFirst(filterLogs(logs, filter)), [logs, filter]);

  const remove = async (id: string) => {
    try {
      await deleteLog(uid, id);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't delete.", { theme: "dark", position: "top-center" });
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <h2 className="mb-3 text-lg font-medium text-dark-gray-8">Log a problem</h2>
        <LogForm key={prefill?.url ?? "blank"} uid={uid} today={today} defaultPatternId={currentPatternId} prefill={prefill} />
      </Panel>

      <div className="flex flex-wrap items-center gap-2">
        <select className={`${inputCls} w-auto`} value={filter.patternId}
          onChange={(e) => setFilter((f) => ({ ...f, patternId: e.target.value }))} aria-label="Filter by pattern">
          <option value="">All patterns</option>
          {PATTERNS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className={`${inputCls} w-auto`} value={filter.solo}
          onChange={(e) => setFilter((f) => ({ ...f, solo: e.target.value as LogFilter["solo"] }))} aria-label="Filter by solo">
          <option value="all">Solo + needed help</option>
          <option value="solo">Solved solo</option>
          <option value="help">Needed help</option>
        </select>
        <input className={`${inputCls} w-auto flex-1 min-w-[180px]`} placeholder="Search name or insight"
          value={filter.text} onChange={(e) => setFilter((f) => ({ ...f, text: e.target.value }))} />
        <button className={btnGhost} onClick={() => downloadCsv(logs, today)} disabled={!logs.length}>Export CSV</button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-dark-divider-border-2">
        <table className="w-full text-left text-sm text-dark-label-2">
          <thead className="bg-dark-layer-1 text-xs uppercase text-dark-gray-6">
            <tr>
              {["Problem", "Pattern", "Diff", "Solo", "Min", "Date", "Reviews", "Next due", ""].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-divider-border-2">
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-dark-gray-6">
                {logs.length ? "No entries match these filters." : "No problems logged yet."}
              </td></tr>
            )}
            {rows.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="max-w-[320px] px-3 py-2">
                  {safeHttpUrl(l.url) ? (
                    <a href={safeHttpUrl(l.url)} target="_blank" rel="noreferrer" className="font-medium text-dark-gray-8 hover:underline">{l.name}</a>
                  ) : <span className="font-medium text-dark-gray-8">{l.name}</span>}
                  <div className="text-xs">{l.insight}</div>
                  {l.stuckOn && <div className="text-xs text-dark-gray-6">Stuck: {l.stuckOn}</div>}
                  {l.complexity && <div className="text-xs text-dark-gray-6">{l.complexity}</div>}
                </td>
                <td className="px-3 py-2 text-xs">{PATTERN_BY_ID[l.patternId]?.name ?? l.patternId}</td>
                <td className="px-3 py-2"><DifficultyChip d={l.difficulty} /></td>
                <td className="px-3 py-2">{l.solvedSolo ? "✓" : <span className="text-dark-yellow">help</span>}</td>
                <td className="px-3 py-2">{l.minutes}</td>
                <td className="whitespace-nowrap px-3 py-2">{l.dateSolved}</td>
                <td className="px-3 py-2"><StageDots stage={l.stage} /></td>
                <td className="whitespace-nowrap px-3 py-2">
                  {isMastered(l) ? <span className="text-dark-green-s">Mastered</span>
                    : <span className={isOverdue(l, today) ? "text-dark-pink" : ""}>{l.nextDue}</span>}
                </td>
                <td className="px-3 py-2"><DeleteButton onConfirm={() => remove(l.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogView;
