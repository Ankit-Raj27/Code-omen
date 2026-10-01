import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Check, ChevronDown, ExternalLink, PlayCircle, Search, Shuffle, Sparkles } from "lucide-react";
import YouTube from "react-youtube";
import { PATTERNS, LEETCODE_URL } from "@/content/patterns";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { useDialog } from "@/hooks/useDialog";
import { currentWeek, patternForWeek } from "@/lib/patternTrack/stats";
import { MASTERED_STAGE } from "@/lib/patternTrack/srs";
import {
  EMPTY_FILTER, groupByPattern, matchesFilter, pickOne, rowState, sortRows, summarize,
  type Difficulty, type ListFilter, type ProblemRow, type RowState, type SortKey,
} from "@/lib/problemList";
import { useSolvedIds } from "./hooks";

type Item = { row: ProblemRow; state: RowState };

export const SHEETS = [
  { href: "/problems", label: "All problems" },
  { href: "/problems/neetcode150", label: "NeetCode 150" },
  { href: "/problems/striver150", label: "Striver 150" },
  { href: "/problems/gfg150", label: "GFG 150" },
] as const;

const DIFFS: Difficulty[] = ["Easy", "Medium", "Hard"];
const DIFF_TEXT: Record<Difficulty, string> = { Easy: "text-[#2cbb5d]", Medium: "text-dark-yellow", Hard: "text-dark-pink" };
const DIFF_BAR: Record<Difficulty, string> = { Easy: "bg-[#2cbb5d]", Medium: "bg-dark-yellow", Hard: "bg-dark-pink" };
const STATUSES: { id: ListFilter["status"]; label: string }[] = [
  { id: "all", label: "Any status" }, { id: "todo", label: "To do" }, { id: "done", label: "Done" },
  { id: "due", label: "Due for review" }, { id: "mastered", label: "Mastered" },
];

const control =
  "rounded-lg border border-white/10 bg-white/[0.04] text-sm text-dark-gray-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s";

// ------------------------------------------------------------------ URL state

const listParam = (v: unknown) => (typeof v === "string" && v ? v.split(",") : []);

function filterFromQuery(q: Record<string, unknown>): ListFilter {
  return {
    query: typeof q.q === "string" ? q.q : "",
    difficulty: listParam(q.d).filter((d): d is Difficulty => (DIFFS as string[]).includes(d)),
    patternIds: listParam(q.p).filter((p) => PATTERNS.some((x) => x.id === p)),
    status: STATUSES.some((s) => s.id === q.s) ? (q.s as ListFilter["status"]) : "all",
    runsHereOnly: q.here === "1",
  };
}

// ------------------------------------------------------------------ pieces

const SheetTabs: React.FC<{ active: string }> = ({ active }) => (
  <nav aria-label="Problem sheets" className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
    {SHEETS.map((s) => (
      <Link key={s.href} href={s.href} aria-current={active === s.href ? "page" : undefined}
        className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          active === s.href ? "bg-white/10 text-white" : "text-dark-gray-6 hover:text-white"
        }`}>
        {s.label}
      </Link>
    ))}
  </nav>
);

const Summary: React.FC<{ items: Item[]; onPick: () => void; canPick: boolean; signedIn: boolean }> = ({ items, onPick, canPick, signedIn }) => {
  const s = summarize(items);
  return (
    <section aria-label="Progress" className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {DIFFS.map((d) => {
          const { done, total } = s.byDifficulty[d];
          return (
            <div key={d}>
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm font-medium ${DIFF_TEXT[d]}`}>{d}</span>
                <span className="text-sm tabular-nums text-dark-gray-7">{done}<span className="text-dark-gray-6">/{total}</span></span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar"
                aria-label={`${d} solved`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
                <div className={`h-full rounded-full ${DIFF_BAR[d]}`} style={{ width: `${total ? (100 * done) / total : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {signedIn && (
          <p className="text-sm text-dark-gray-7">
            <span className="text-lg font-semibold tabular-nums text-white">{s.due}</span> due
            <span className="mx-2 text-white/20">|</span>
            <span className="text-lg font-semibold tabular-nums text-white">{s.mastered}</span> mastered
          </p>
        )}
        <button type="button" onClick={onPick} disabled={!canPick}
          className="ml-auto inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 text-sm font-medium text-white hover:from-purple-500 hover:to-blue-500 disabled:opacity-40">
          <Shuffle size={16} aria-hidden="true" /> Pick one for me
        </button>
      </div>
    </section>
  );
};

const StatusMark: React.FC<{ state: RowState }> = ({ state }) => {
  switch (state.status) {
    case "todo":
      return <span className="block h-3.5 w-3.5 rounded-full border border-white/25" aria-label="Not done" />;
    case "solved":
      return <Check size={16} className="text-[#2cbb5d]" aria-label="Solved" />;
    case "mastered":
      return <Sparkles size={16} className="text-[#2cbb5d]" aria-label="Mastered" />;
    default:
      return (
        <span className="flex gap-[3px]" aria-label={`Review stage ${state.stage} of ${MASTERED_STAGE}${state.status === "due" ? ", due" : ""}`}>
          {Array.from({ length: MASTERED_STAGE }, (_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${
              i < (state.stage ?? 0) ? (state.status === "due" ? "bg-dark-pink" : "bg-[#2cbb5d]") : "bg-white/15"
            }`} />
          ))}
        </span>
      );
  }
};

const Row: React.FC<{ item: Item; today: string; signedIn: boolean; onVideo: (id: string) => void }> = ({ item: { row, state }, today, signedIn, onVideo }) => {
  const title = (
    <>
      {row.number && <span className="mr-2 tabular-nums text-dark-gray-6">{row.number}.</span>}
      {row.title}
      {row.external && <ExternalLink size={13} className="ml-1.5 inline-block -translate-y-px text-dark-gray-6" aria-label="(opens on LeetCode)" />}
    </>
  );
  const linkCls = "rounded outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s text-[15px] text-dark-gray-8 group-hover:text-white";
  return (
    <li className="group grid grid-cols-[28px_1fr] items-center gap-x-3 gap-y-1 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/[0.04] sm:grid-cols-[28px_1fr_auto]">
      <span className="flex justify-center"><StatusMark state={state} /></span>
      <span className="min-w-0">
        {row.external ? (
          <a data-row-link href={row.href} target="_blank" rel="noreferrer" className={linkCls}>{title}</a>
        ) : (
          <Link data-row-link href={row.href} className={linkCls}>{title}</Link>
        )}
        {row.stretch && <span className="ml-2 rounded border border-white/10 px-1.5 py-px text-[11px] text-dark-gray-6">stretch</span>}
      </span>
      <span className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:col-start-3 sm:justify-end">
        {state.status === "due" && <span className="font-medium text-dark-pink">Review due</span>}
        {state.status === "review" && state.nextDue && (
          <span className="text-dark-gray-6">Review {state.nextDue === today ? "today" : `on ${state.nextDue.slice(5).replace("-", "/")}`}</span>
        )}
        {row.languages.map((l) => (
          <span key={l} className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-dark-gray-7">{l}</span>
        ))}
        <span className={`w-14 font-medium ${DIFF_TEXT[row.difficulty]}`}>{row.difficulty}</span>
        <span className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          {row.videoId && (
            <button type="button" onClick={() => onVideo(row.videoId!)} aria-label={`Watch a solution video for ${row.title}`}
              className="inline-flex min-h-[32px] items-center rounded px-1.5 text-dark-gray-6 hover:bg-white/10 hover:text-white">
              <PlayCircle size={16} aria-hidden="true" />
            </button>
          )}
          {!row.external && (
            <a href={LEETCODE_URL(row.key)} target="_blank" rel="noreferrer" aria-label={`${row.title} on LeetCode`}
              className="inline-flex min-h-[32px] items-center rounded px-1.5 text-dark-gray-6 hover:bg-white/10 hover:text-white">
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          )}
          {signedIn && state.status === "todo" && row.patternId && (
            <Link href={`/log?slug=${encodeURIComponent(row.key)}`}
              className="inline-flex min-h-[32px] items-center rounded px-2 text-dark-gray-6 hover:bg-white/10 hover:text-white">
              Log
            </Link>
          )}
        </span>
      </span>
    </li>
  );
};

/** One pattern on the track: a week marker on the rail whose ring fills with progress. */
const TrackGroup: React.FC<{
  id: string; title: string; week?: number; items: Item[]; done: number; current: boolean;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}> = ({ id, title, week, items, done, current, open, onToggle, children }) => {
  const pct = items.length ? Math.round((100 * done) / items.length) : 0;
  return (
    <section aria-labelledby={`g-${id}`} className="relative pl-12">
      {/* Rail: the line runs down the left edge, the marker sits on it. */}
      <span aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-purple-500/40 via-white/10 to-white/10" />
      <span aria-hidden="true"
        className={`absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full ${current ? "shadow-[0_0_24px_rgba(168,85,247,0.55)]" : ""}`}
        style={{ background: `conic-gradient(#2cbb5d ${pct}%, rgba(255,255,255,0.12) 0)` }}>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs font-semibold tabular-nums text-white">
          {week ? (week >= 18 ? "18+" : week) : "·"}
        </span>
      </span>
      <h2 id={`g-${id}`} className="m-0">
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`gl-${id}`}
          className="flex min-h-[48px] w-full items-center gap-3 rounded-lg pr-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s">
          <span className="text-lg font-semibold text-white">{title}</span>
          {current && <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-200">This week</span>}
          <span className="ml-auto text-sm tabular-nums text-dark-gray-6">{done}/{items.length}</span>
          <ChevronDown size={18} aria-hidden="true" className={`text-dark-gray-6 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
      </h2>
      <div id={`gl-${id}`} hidden={!open} className="pb-6">{children}</div>
    </section>
  );
};

const VideoDialog: React.FC<{ videoId: string; onClose: () => void }> = ({ videoId, onClose }) => {
  const ref = useDialog<HTMLDivElement>(true, onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Solution video" className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20">Close</button>
        </div>
        <YouTube videoId={videoId} loading="lazy" iframeClassName="aspect-video h-auto w-full rounded-xl" />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ browser

type Props = {
  sheetHref: string;
  rows: ProblemRow[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
};

/** Problem list: progress, filters, and the problems laid out along the Pattern Track. */
const ProblemBrowser: React.FC<Props> = ({ sheetHref, rows, loading, error, onRetry }) => {
  const router = useRouter();
  const { user, logs, startDate, today } = usePatternTrack();
  const solvedIds = useSolvedIds(user);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<ListFilter>(EMPTY_FILTER);
  const [sort, setSort] = useState<SortKey>("default");
  const [flat, setFlat] = useState(false);
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const [video, setVideo] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters live in the URL, so a filtered list can be bookmarked or shared.
  useEffect(() => {
    if (!router.isReady) return;
    setFilter(filterFromQuery(router.query));
    if (typeof router.query.sort === "string") setSort(router.query.sort as SortKey);
    setFlat(router.query.view === "flat");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const update = (next: Partial<ListFilter>, extra: Record<string, string | undefined> = {}) => {
    const f = { ...filter, ...next };
    setFilter(f);
    const q: Record<string, string> = {};
    if (f.query) q.q = f.query;
    if (f.difficulty.length) q.d = f.difficulty.join(",");
    if (f.patternIds.length) q.p = f.patternIds.join(",");
    if (f.status !== "all") q.s = f.status;
    if (f.runsHereOnly) q.here = "1";
    const s = extra.sort ?? (sort !== "default" ? sort : undefined);
    if (s && s !== "default") q.sort = s;
    const v = extra.view ?? (flat ? "flat" : undefined);
    if (v === "flat") q.view = "flat";
    router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true, scroll: false });
  };

  const items = useMemo<Item[]>(
    () => rows.map((row) => ({ row, state: rowState(row, logs, solvedIds, today) })),
    [rows, logs, solvedIds, today],
  );
  const visible = useMemo(() => sortRows(items.filter((i) => matchesFilter(i.row, i.state, filter)), sort), [items, filter, sort]);
  const groups = useMemo(() => groupByPattern(visible), [visible]);
  const weekPattern = patternForWeek(Math.max(1, currentWeek(startDate, today)))?.id;
  const filtered = JSON.stringify(filter) !== JSON.stringify(EMPTY_FILTER);

  const pick = () => {
    const choice = pickOne(visible.length ? visible : items, weekPattern, Date.now() / 1000);
    if (!choice) return;
    if (choice.row.external) window.open(choice.row.href, "_blank", "noopener");
    else router.push(choice.row.href);
  };

  // Keyboard: "/" focuses search; j / k move between problems.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable=true]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") { e.preventDefault(); searchRef.current?.focus(); return; }
      if (e.key !== "j" && e.key !== "k") return;
      const links = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-row-link]") ?? []).filter((l) => l.offsetParent);
      if (!links.length) return;
      e.preventDefault();
      const i = links.indexOf(document.activeElement as HTMLElement);
      const next = e.key === "j" ? Math.min(links.length - 1, i + 1) : Math.max(0, i < 0 ? 0 : i - 1);
      links[next].focus();
      links[next].scrollIntoView({ block: "nearest" });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const rowList = (its: Item[]) => (
    <ul className="space-y-0.5">
      {its.map((it) => <Row key={it.row.key} item={it} today={today} signedIn={!!user} onVideo={setVideo} />)}
    </ul>
  );

  return (
    <div>
      <SheetTabs active={sheetHref} />
      <Summary items={items} onPick={pick} canPick={items.some((i) => i.state.status === "todo")} signedIn={!!user} />

      {/* Toolbar */}
      <div role="search" className="mb-6 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Search problems</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dark-gray-6" />
          <input ref={searchRef} type="search" value={filter.query} onChange={(e) => update({ query: e.target.value })}
            placeholder="Search by title or number  ( / )" className={`${control} h-10 w-full pl-9 pr-3 placeholder:text-dark-gray-6`} />
        </label>
        <button type="button" aria-expanded={filtersOpen} aria-controls="list-filters" onClick={() => setFiltersOpen((o) => !o)}
          className={`${control} h-10 px-3 sm:hidden`}>
          Filters{filtered ? ` (${filter.difficulty.length + filter.patternIds.length + (filter.status !== "all" ? 1 : 0) + (filter.runsHereOnly ? 1 : 0)})` : ""}
        </button>
        <div id="list-filters" className={`${filtersOpen ? "flex" : "hidden"} w-full flex-wrap items-center gap-2 sm:flex sm:w-auto`}>
        <div role="group" aria-label="Difficulty" className="flex gap-1">
          {DIFFS.map((d) => {
            const on = filter.difficulty.includes(d);
            return (
              <button key={d} type="button" aria-pressed={on}
                onClick={() => update({ difficulty: on ? filter.difficulty.filter((x) => x !== d) : [...filter.difficulty, d] })}
                className={`h-10 rounded-lg border px-3 text-sm font-medium transition-colors ${
                  on ? `border-white/30 bg-white/10 ${DIFF_TEXT[d]}` : "border-white/10 text-dark-gray-6 hover:text-white"
                }`}>
                {d}
              </button>
            );
          })}
        </div>
        <select aria-label="Status" value={filter.status} onChange={(e) => update({ status: e.target.value as ListFilter["status"] })} className={`${control} h-10 px-3`}>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select aria-label="Pattern" value={filter.patternIds[0] ?? ""} onChange={(e) => update({ patternIds: e.target.value ? [e.target.value] : [] })} className={`${control} h-10 max-w-[220px] px-3`}>
          <option value="">All patterns</option>
          {PATTERNS.filter((p) => p.problems.length).map((p) => <option key={p.id} value={p.id}>Week {p.week}: {p.name}</option>)}
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => { setSort(e.target.value as SortKey); update({}, { sort: e.target.value }); }} className={`${control} h-10 px-3`}>
          <option value="default">Roadmap order</option>
          <option value="difficulty">Difficulty</option>
          <option value="title">Title</option>
          <option value="due">Next review</option>
        </select>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-dark-gray-7">
          <input type="checkbox" checked={filter.runsHereOnly} onChange={(e) => update({ runsHereOnly: e.target.checked })} className="accent-purple-500" />
          Runs in CodeOmen
        </label>
        <button type="button" aria-pressed={flat} onClick={() => { setFlat(!flat); update({}, { view: flat ? "" : "flat" }); }}
          className="h-10 rounded-lg border border-white/10 px-3 text-sm text-dark-gray-7 hover:text-white">
          {flat ? "Group by pattern" : "Show as one list"}
        </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{loading ? "Loading problems" : `${visible.length} problems shown`}</p>

      <div ref={listRef}>
        {error ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-dark-gray-8">Couldn&apos;t load this sheet. Check your connection and try again.</p>
            {onRetry && <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">Try again</button>}
          </div>
        ) : loading ? (
          <ul aria-hidden="true" className="space-y-2 pl-12">
            {Array.from({ length: 8 }, (_, i) => <li key={i} className="h-11 animate-pulse rounded-lg bg-white/[0.04] motion-reduce:animate-none" />)}
          </ul>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-dark-gray-8">{rows.length ? "No problems match these filters." : "This sheet has no problems yet."}</p>
            {filtered && (
              <button type="button" onClick={() => update(EMPTY_FILTER)} className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
                Clear filters
              </button>
            )}
          </div>
        ) : flat || sort !== "default" ? (
          rowList(visible)
        ) : (
          <div className="space-y-2">
            {groups.map((g) => (
              <TrackGroup key={g.id} id={g.id} title={g.title} week={g.week} items={g.items} done={g.done} current={g.id === weekPattern && !!user}
                open={!closed.has(g.id)} onToggle={() => setClosed((c) => { const n = new Set(c); if (n.has(g.id)) n.delete(g.id); else n.add(g.id); return n; })}>
                {rowList(g.items)}
              </TrackGroup>
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-dark-gray-6">
        Keys: <kbd className="rounded bg-white/10 px-1">/</kbd> search, <kbd className="rounded bg-white/10 px-1">j</kbd> <kbd className="rounded bg-white/10 px-1">k</kbd> move, <kbd className="rounded bg-white/10 px-1">Enter</kbd> open.
      </p>

      {video && <VideoDialog videoId={video} onClose={() => setVideo(null)} />}
    </div>
  );
};

export default ProblemBrowser;
