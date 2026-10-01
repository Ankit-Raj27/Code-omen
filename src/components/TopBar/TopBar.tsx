import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, useReducedMotion } from "framer-motion";
import { signOut } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutList, LogOut, Menu, User, X, BookOpen } from "lucide-react";
import { auth } from "@/Firebase/firebase";
import { authModalState } from "@/atoms/authModalAtom";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { useDialog } from "@/hooks/useDialog";
import { dueQueue } from "@/lib/patternTrack/srs";
import { currentWeek, patternForWeek } from "@/lib/patternTrack/stats";
import { problems } from "@/utils/problems";
import Timer from "../timer/Timer";

type TopBarProps = {
  problemPage?: boolean;
};

const MAIN = [
  { href: "/", label: "Today" },
  { href: "/patterns", label: "Patterns" },
  { href: "/problems", label: "Problems" },
  { href: "/log", label: "Log" },
] as const;

const SHEETS = [
  { href: "/problems", label: "All problems" },
  { href: "/problems/neetcode150", label: "NeetCode 150" },
  { href: "/problems/striver150", label: "Striver 150" },
  { href: "/problems/gfg150", label: "GFG 150" },
];

const ROADMAP_WEEKS = 18;

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/** Bank problems in their running order, for previous / next on a problem page. */
function useBankOrder() {
  return useMemo(() => Object.values(problems).sort((a, b) => a.order - b.order).map((p) => p.id), []);
}

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s";

/** Closes a popover on outside click or Escape. */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  return { open, setOpen, ref };
}

/** Where you are on the 18-week track: a ring that fills week by week. */
const WeekChip: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { user, startDate, today } = usePatternTrack();
  if (!user) return null;
  const week = currentWeek(startDate, today);
  const pattern = patternForWeek(week);
  const pct = Math.min(100, Math.round((100 * Math.min(week, ROADMAP_WEEKS)) / ROADMAP_WEEKS));
  return (
    <Link href={pattern ? `/patterns/${pattern.id}` : "/patterns"} title={pattern ? `This week: ${pattern.name}` : "Your roadmap"}
      className={`group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-dark-gray-7 hover:border-purple-400/40 hover:text-white ${focusRing}`}>
      <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full"
        style={{ background: `conic-gradient(rgb(168 85 247) ${pct}%, rgba(255,255,255,0.12) 0)` }}>
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-black text-[10px] font-semibold tabular-nums text-white">
          {week === 0 ? "–" : Math.min(week, 99)}
        </span>
      </span>
      {week === 0 ? "Starts soon" : <span>Week {week}{!compact && pattern ? <span className="text-dark-gray-6">, {pattern.name}</span> : null}</span>}
    </Link>
  );
};

const AccountMenu: React.FC = () => {
  const { user } = usePatternTrack();
  const router = useRouter();
  const { open, setOpen, ref } = usePopover();
  if (!user) return null;
  const leave = async () => { setOpen(false); await signOut(auth); router.push("/auth"); };
  const item = `flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-dark-gray-8 hover:bg-white/10 ${focusRing}`;
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Account" onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-full p-0.5 hover:bg-white/10 ${focusRing}`}>
        <Image src="/avatar.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full ring-1 ring-white/15" />
        <ChevronDown size={14} className="text-dark-gray-6" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-60 rounded-xl border border-white/10 bg-[#0d0d12]/95 p-1.5 shadow-2xl backdrop-blur">
          <p className="truncate px-3 py-2 text-xs text-dark-gray-6">{user.email}</p>
          <Link role="menuitem" href="/profile" className={item} onClick={() => setOpen(false)}><User size={15} aria-hidden="true" /> Profile and settings</Link>
          <Link role="menuitem" href="/method" className={item} onClick={() => setOpen(false)}><BookOpen size={15} aria-hidden="true" /> How to study</Link>
          <div className="my-1 h-px bg-white/10" />
          <button role="menuitem" type="button" className={item} onClick={leave}><LogOut size={15} aria-hidden="true" /> Sign out</button>
        </div>
      )}
    </div>
  );
};

const SignInButton: React.FC = () => {
  const { user, authLoading } = usePatternTrack();
  const setAuthModal = useSetRecoilState(authModalState);
  if (user || authLoading) return null;
  return (
    <Link href="/auth" onClick={() => setAuthModal((s) => ({ ...s, isOpen: true, type: "login" }))}
      className={`rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:from-purple-500 hover:to-blue-500 ${focusRing}`}>
      Sign in
    </Link>
  );
};

/** Desktop navigation: a segmented pill whose highlight slides to the current page. */
const MainNav: React.FC = () => {
  const { pathname } = useRouter();
  const { user, logs, today } = usePatternTrack();
  const reduce = useReducedMotion();
  const due = user ? dueQueue(logs, today).length : 0;
  const sheets = usePopover();
  return (
    <nav aria-label="Main" className="hidden items-center rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
      {MAIN.map((m) => {
        const active = isActive(pathname, m.href);
        const pill = (
          <Link href={m.href} aria-current={active ? "page" : undefined}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-colors ${active ? "text-white" : "text-dark-gray-7 hover:text-white"} ${focusRing}`}>
            {active && (
              <motion.span layoutId="nav-pill" aria-hidden="true" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 -z-10 rounded-full bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            )}
            {m.label}
            {m.href === "/" && due > 0 && (
              <span className="rounded-full bg-dark-pink px-1.5 text-[11px] font-semibold leading-4 text-white" aria-label={`${due} reviews due`}>{due}</span>
            )}
          </Link>
        );
        if (m.href !== "/problems") return <React.Fragment key={m.href}>{pill}</React.Fragment>;
        return (
          <div key={m.href} className="relative flex items-center" ref={sheets.ref}>
            {pill}
            <button type="button" aria-label="Problem sheets" aria-haspopup="menu" aria-expanded={sheets.open} onClick={() => sheets.setOpen((o) => !o)}
              className={`-ml-1 rounded-full p-1.5 text-dark-gray-6 hover:text-white ${focusRing}`}>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {sheets.open && (
              <div role="menu" className="absolute left-0 top-10 z-50 w-48 rounded-xl border border-white/10 bg-[#0d0d12]/95 p-1.5 shadow-2xl backdrop-blur">
                {SHEETS.map((s) => (
                  <Link key={s.href} role="menuitem" href={s.href} onClick={() => sheets.setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm hover:bg-white/10 ${pathname === s.href ? "text-white" : "text-dark-gray-7"} ${focusRing}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

/** Phones: a menu panel with every destination. */
const MobileMenu: React.FC = () => {
  const { pathname } = useRouter();
  const { user, logs, today } = usePatternTrack();
  const [open, setOpen] = useState(false);
  const ref = useDialog<HTMLDivElement>(open, () => setOpen(false));
  const due = user ? dueQueue(logs, today).length : 0;
  useEffect(() => setOpen(false), [pathname]);
  const row = (href: string, label: string, extra?: React.ReactNode) => (
    <Link key={href + label} href={href} aria-current={pathname === href ? "page" : undefined}
      className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base ${pathname === href ? "bg-white/10 text-white" : "text-dark-gray-7"}`}>
      {label}{extra}
    </Link>
  );
  return (
    <>
      <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}
        className={`relative rounded-lg p-2 text-dark-gray-7 hover:text-white md:hidden ${focusRing}`}>
        <Menu size={20} aria-hidden="true" />
        {due > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-dark-pink" aria-hidden="true" />}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 md:hidden" onClick={() => setOpen(false)}>
          <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 top-3 rounded-2xl border border-white/10 bg-[#0d0d12] p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <WeekChip />
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className={`ml-auto rounded-lg p-2 text-dark-gray-7 hover:text-white ${focusRing}`}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Main">
              {MAIN.map((m) => row(m.href, m.label, m.href === "/" && due > 0 ? <span className="text-sm text-dark-pink">{due} due</span> : undefined))}
              <p className="px-3 pb-1 pt-3 text-xs text-dark-gray-6">Sheets</p>
              {SHEETS.slice(1).map((s) => row(s.href, s.label))}
              {user && (
                <>
                  <div className="my-2 h-px bg-white/10" />
                  {row("/profile", "Profile and settings")}
                  {row("/method", "How to study")}
                  <button type="button" onClick={() => signOut(auth)} className="flex min-h-[44px] w-full items-center rounded-lg px-3 text-left text-base text-dark-gray-7">
                    Sign out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

/** Problem pages: step through the bank, with your position in it. */
const ProblemStepper: React.FC = () => {
  const router = useRouter();
  const order = useBankOrder();
  const pid = String(router.query.pid ?? "");
  const i = order.indexOf(pid);
  const go = (d: number) => router.push(`/problems/${order[(i + d + order.length) % order.length]}`);
  const btn = `grid h-8 w-8 place-items-center rounded-lg text-dark-gray-7 hover:bg-white/10 hover:text-white ${focusRing}`;
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      <button type="button" className={btn} aria-label="Previous problem" title="Previous problem" onClick={() => go(-1)}>
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <Link href="/problems" className={`flex min-h-[32px] items-center gap-2 rounded-full px-2 text-sm text-dark-gray-8 hover:text-white ${focusRing}`}>
        <LayoutList size={15} aria-hidden="true" />
        <span className="hidden sm:inline">Problems</span>
        {i >= 0 && <span className="hidden tabular-nums text-dark-gray-6 lg:inline">{i + 1} of {order.length}</span>}
      </Link>
      <button type="button" className={btn} aria-label="Next problem" title="Next problem" onClick={() => go(1)}>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

const TopBar: React.FC<TopBarProps> = ({ problemPage }) => {
  const { user } = usePatternTrack();
  return (
    <header className={`sticky top-0 z-40 h-[50px] w-full shrink-0 ${problemPage ? "bg-black" : "bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60"}`}>
      <div className={`flex h-full items-center gap-3 px-4 ${problemPage ? "" : "mx-auto max-w-[1200px] sm:px-6"}`}>
        <Link href="/" aria-label="CodeOmen home" className={`flex min-h-[32px] shrink-0 items-center rounded ${focusRing}`}>
          <Image src="/logo1.png" alt="CodeOmen" width={148} height={42} className="h-auto w-[118px] sm:w-[132px]" priority />
        </Link>

        <div className="flex flex-1 justify-center">
          {problemPage ? <ProblemStepper /> : <MainNav />}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {problemPage ? user && <Timer /> : <span className="hidden lg:block"><WeekChip /></span>}
          <SignInButton />
          <span className="hidden md:block"><AccountMenu /></span>
          {!problemPage && <MobileMenu />}
          {problemPage && <span className="md:hidden"><AccountMenu /></span>}
        </div>
      </div>
      {/* The brand edge: a hairline that fades purple to blue. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-blue-500/40" />
    </header>
  );
};
export default TopBar;
