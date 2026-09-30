import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Grid3x3, LineChart, Settings } from "lucide-react";
import useHasMounted from "@/components/hooks/useHasMounted";
import PageFrame from "@/components/layout/PageFrame";
import { downloadCsv } from "@/components/patternTrack/LogView";
import RequireSignIn from "@/components/patternTrack/RequireSignIn";
import dynamic from "next/dynamic";

// Charts (recharts) load on demand; the rest of the page doesn't wait for them.
const TrackCharts = dynamic(() => import("@/components/patternTrack/TrackCharts"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-xl bg-gray-900/50" aria-label="Loading charts" />,
});
import { ErrorState, EmptyState, Panel, SectionTitle, StatTile, btnGhost, inputCls } from "@/components/patternTrack/ui";
import { ActivityHeatmap, MasteryGrid } from "@/components/profile/ProfileViews";

const SoloTrendChart = dynamic(() => import("@/components/profile/SoloTrendChart").then((m) => m.SoloTrendChart), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-xl bg-gray-900/50" aria-label="Loading chart" />,
});
import { usePatternTrack } from "@/context/PatternTrackContext";
import { setPreferredLanguage, setStartDate, type EditorLanguagePref } from "@/lib/patternTrack/firestore";
import { save } from "@/components/patternTrack/save";
import {
  currentWeek, dailyActivity, streak, todayStats, weekLabel, weeklyActivity,
} from "@/lib/patternTrack/stats";

const fail = (what: string) => toast.error(`Couldn't save the ${what}.`, { theme: "dark", position: "top-center" });

/** Profile: the long-term view of the same log that powers Today. One Firestore subscription. */
export default function ProfilePage() {
  const hasMounted = useHasMounted();
  const reduce = useReducedMotion();
  const {
    user, authLoading, logs, loading, error, retry, startDate, setStartDateState, today,
    preferredLanguage, setPreferredLanguageState,
  } = usePatternTrack();

  if (!hasMounted) return null;

  const name = user?.displayName || user?.email?.split("@")[0] || "Your profile";
  const fade = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.1 } } };

  const body = (() => {
    if (authLoading) return null;
    if (!user) return <RequireSignIn what="see your progress" />;
    if (error) return <ErrorState onRetry={retry} />;
    if (loading) return <div className="h-64 animate-pulse rounded-xl bg-gray-900/50" />;

    const stats = todayStats(logs, today);
    const days = streak(logs, today);
    const week = currentWeek(startDate, today);
    const reviews = logs.reduce((n, l) => n + (l.reviews?.length ?? 0), 0);
    const lang = preferredLanguage ?? "javascript";

    const changeStart = async (d: string) => {
      setStartDateState(d);
      try { await save(setStartDate(user.uid, d), "start date"); } catch { fail("start date"); }
    };
    const changeLang = async (l: EditorLanguagePref) => {
      setPreferredLanguageState(l);
      try {
        window.localStorage.setItem("cd-language", JSON.stringify(l));
      } catch { /* storage unavailable */ }
      try { await save(setPreferredLanguage(user.uid, l), "language"); } catch { fail("language"); }
    };

    return (
      <motion.div className="space-y-10" initial="hidden" animate="visible" variants={stagger}>
        <motion.div className="grid grid-cols-2 gap-3 md:grid-cols-5" variants={fade}>
          <StatTile label="Problems logged" value={stats.totalLogged} />
          <StatTile label="Reviews done" value={reviews} />
          <StatTile label="Mastered" value={stats.mastered} />
          <StatTile label="Mediums solved solo" value={stats.mediumSoloPct === null ? "—" : `${stats.mediumSoloPct}%`} hint="goal 60% by week 10" />
          <StatTile label="Streak" value={`${days} day${days === 1 ? "" : "s"}`} />
        </motion.div>

        <motion.section variants={fade}>
          <SectionTitle icon={<CalendarDays size={22} className="text-green-400" />}>Activity</SectionTitle>
          <ActivityHeatmap days={dailyActivity(logs, today, 52)} today={today} />
        </motion.section>

        <motion.section variants={fade}>
          <SectionTitle icon={<LineChart size={22} className="text-blue-400" />}>Trends</SectionTitle>
          <div className="space-y-4">
            <TrackCharts weeks={weeklyActivity(logs, today, 12)} />
            <SoloTrendChart weeks={weeklyActivity(logs, today, 12)} />
          </div>
        </motion.section>

        <motion.section variants={fade}>
          <SectionTitle icon={<Grid3x3 size={22} className="text-purple-400" />}
            action={<Link href="/patterns" className="text-sm text-gray-400 hover:text-white">All patterns →</Link>}>
            Pattern mastery
          </SectionTitle>
          <MasteryGrid logs={logs} currentWeek={week} />
        </motion.section>

        <motion.section id="settings" variants={fade} className="scroll-mt-20">
          <SectionTitle icon={<Settings size={22} className="text-gray-400" />}>Settings</SectionTitle>
          <Panel className="grid gap-5 md:grid-cols-3">
            <label className="block text-sm text-gray-300">
              Track start date
              <input type="date" className={`${inputCls} mt-1`} value={startDate}
                onChange={(e) => e.target.value && changeStart(e.target.value)} />
              <span className="mt-1 block text-xs text-gray-500">Week 1 starts on this date. {weekLabel(startDate, today)}.</span>
            </label>
            <label className="block text-sm text-gray-300">
              Default editor language
              <select className={`${inputCls} mt-1`} value={lang} onChange={(e) => changeLang(e.target.value as EditorLanguagePref)}>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
              <span className="mt-1 block text-xs text-gray-500">Used when a problem supports it; saved to your account.</span>
            </label>
            <div className="text-sm text-gray-300">
              Your data
              <div className="mt-1">
                <button className={btnGhost} disabled={!logs.length} onClick={() => downloadCsv(logs, today)}>
                  Export log as CSV
                </button>
              </div>
              <span className="mt-1 block text-xs text-gray-500">{logs.length} entries, with review history.</span>
            </div>
          </Panel>
        </motion.section>
      </motion.div>
    );
  })();

  return (
    <PageFrame
      title={user ? name : "Profile"}
      subtitle={user ? `${user.email ?? ""}${user.email ? " · " : ""}${weekLabel(startDate, today)}` : undefined}>
      {body}
    </PageFrame>
  );
}
