import React, { useState } from "react";
import { toast } from "react-toastify";
import { PATTERNS } from "@/content/patterns";
import { addLog } from "@/lib/patternTrack/firestore";
import type { LogPrefill } from "@/lib/patternTrack/bank";
import type { LogDifficulty } from "@/lib/patternTrack/stats";
import type { Ymd } from "@/lib/patternTrack/dates";
import { btnPrimary, inputCls } from "./ui";

type Props = {
  uid: string;
  today: Ymd;
  prefill?: Partial<LogPrefill>;
  defaultPatternId?: string;
  onSaved?: () => void;
};

const empty = (today: Ymd, prefill: Partial<LogPrefill> = {}, patternId?: string) => ({
  name: prefill.name ?? "",
  url: prefill.url ?? "",
  patternId: prefill.patternId ?? patternId ?? PATTERNS[0].id,
  difficulty: (prefill.difficulty ?? "M") as LogDifficulty,
  minutes: "25",
  dateSolved: today,
  solvedSolo: true,
  insight: "",
  stuckOn: "",
  complexity: "",
});

const LogForm: React.FC<Props> = ({ uid, today, prefill, defaultPatternId, onSaved }) => {
  const [f, setF] = useState(() => empty(today, prefill, defaultPatternId));
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.insight.trim()) return;
    setSaving(true);
    try {
      await addLog(uid, {
        name: f.name,
        url: f.url,
        patternId: f.patternId,
        difficulty: f.difficulty,
        solvedSolo: f.solvedSolo,
        minutes: Number(f.minutes) || 0,
        dateSolved: f.dateSolved,
        insight: f.insight,
        stuckOn: f.stuckOn,
        complexity: f.complexity,
        bankSlug: prefill?.bankSlug,
      });
      toast.success("Logged. First review is tomorrow.", { theme: "dark", position: "top-center", autoClose: 2000 });
      setF(empty(today, {}, f.patternId));
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save. Check your connection and try again.", { theme: "dark", position: "top-center" });
    } finally {
      setSaving(false);
    }
  };

  const label = "block text-xs text-dark-gray-6";
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-6">
      <label className={`${label} sm:col-span-3`}>
        Problem *
        <input required maxLength={200} className={`${inputCls} mt-1`} value={f.name}
          onChange={(e) => set("name", e.target.value)} placeholder="Two Sum" />
      </label>
      <label className={`${label} sm:col-span-3`}>
        URL
        <input type="url" className={`${inputCls} mt-1`} value={f.url}
          onChange={(e) => set("url", e.target.value)} placeholder="https://leetcode.com/problems/two-sum/" />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Pattern
        <select className={`${inputCls} mt-1`} value={f.patternId} onChange={(e) => set("patternId", e.target.value)}>
          {PATTERNS.map((p) => <option key={p.id} value={p.id}>{p.week}. {p.name}</option>)}
        </select>
      </label>
      <label className={label}>
        Difficulty
        <select className={`${inputCls} mt-1`} value={f.difficulty}
          onChange={(e) => set("difficulty", e.target.value as LogDifficulty)}>
          <option value="E">Easy</option><option value="M">Medium</option><option value="H">Hard</option>
        </select>
      </label>
      <label className={label}>
        Minutes
        <input type="number" min={0} max={600} className={`${inputCls} mt-1`} value={f.minutes}
          onChange={(e) => set("minutes", e.target.value)} />
      </label>
      <label className={label}>
        Date solved
        <input type="date" required max={today} className={`${inputCls} mt-1`} value={f.dateSolved}
          onChange={(e) => set("dateSolved", e.target.value)} />
      </label>
      <label className={`${label} flex items-end gap-2 pb-2`}>
        <input type="checkbox" checked={f.solvedSolo} onChange={(e) => set("solvedSolo", e.target.checked)}
          className="h-4 w-4 accent-[rgb(44,187,93)]" />
        <span className="text-sm text-dark-label-2">Solved solo</span>
      </label>
      <label className={`${label} sm:col-span-6`}>
        Insight * <span className="text-dark-gray-6">(one line — the trick you want to recall in 3 weeks)</span>
        <input required maxLength={300} className={`${inputCls} mt-1`} value={f.insight}
          onChange={(e) => set("insight", e.target.value)} placeholder="Store complements in a map; check before insert" />
      </label>
      <label className={`${label} sm:col-span-3`}>
        Stuck on
        <input maxLength={300} className={`${inputCls} mt-1`} value={f.stuckOn} onChange={(e) => set("stuckOn", e.target.value)} />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Complexity
        <input maxLength={100} className={`${inputCls} mt-1`} value={f.complexity}
          onChange={(e) => set("complexity", e.target.value)} placeholder="O(n) time, O(n) space" />
      </label>
      <div className="flex items-end sm:col-span-1">
        <button type="submit" disabled={saving} className={`${btnPrimary} w-full`}>{saving ? "Saving…" : "Log it"}</button>
      </div>
    </form>
  );
};

export default LogForm;
