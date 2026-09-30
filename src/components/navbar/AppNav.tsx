import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePatternTrack } from "@/context/PatternTrackContext";
import { dueQueue } from "@/lib/patternTrack/srs";
import { weekLabel } from "@/lib/patternTrack/stats";

const LISTS = [
  { href: "/problems/neetcode150", label: "NeetCode 150" },
  { href: "/problems/striver150", label: "Striver 150" },
  { href: "/problems/gfg150", label: "GFG 150" },
];

const MAIN = [
  { href: "/", label: "Today" },
  { href: "/patterns", label: "Patterns" },
  { href: "/log", label: "Log" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const linkCls = (active: boolean) =>
  `rounded-md px-3 py-1.5 text-sm transition-colors ${
    active ? "bg-dark-fill-3 text-white" : "text-dark-gray-7 hover:text-white"
  }`;

/** Primary navigation: Today · Patterns · Log · Lists, plus week chip and due badge. */
const AppNav: React.FC = () => {
  const { pathname } = useRouter();
  const { user, logs, startDate, today } = usePatternTrack();
  const [listsOpen, setListsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const listsRef = useRef<HTMLDivElement>(null);
  const due = user ? dueQueue(logs, today).length : 0;

  useEffect(() => {
    setMobileOpen(false);
    setListsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!listsOpen) return;
    const close = (e: MouseEvent) => {
      if (!listsRef.current?.contains(e.target as Node)) setListsOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setListsOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [listsOpen]);

  const listsActive = LISTS.some((l) => pathname === l.href);

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-1 md:flex">
        {MAIN.map((m) => (
          <Link key={m.href} href={m.href} className={linkCls(isActive(pathname, m.href))}
            aria-current={isActive(pathname, m.href) ? "page" : undefined}>
            {m.label}
            {m.href === "/" && due > 0 && (
              <span className="ml-1.5 rounded-full bg-dark-pink px-1.5 text-[11px] font-semibold text-white" aria-label={`${due} due`}>
                {due}
              </span>
            )}
          </Link>
        ))}
        <div className="relative" ref={listsRef}>
          <button className={linkCls(listsActive)} aria-haspopup="menu" aria-expanded={listsOpen}
            onClick={() => setListsOpen((o) => !o)}>
            Lists ▾
          </button>
          {listsOpen && (
            <div role="menu" className="absolute left-0 top-9 z-50 w-44 rounded-xl border border-gray-800 bg-gray-900 p-1 shadow-lg">
              {LISTS.map((l) => (
                <Link key={l.href} href={l.href} role="menuitem"
                  className="block rounded-md px-3 py-2 text-sm text-dark-label-2 hover:bg-dark-fill-3">
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {user && (
          <Link href="/patterns" className="ml-2 hidden rounded bg-dark-fill-3 px-2 py-1 text-xs text-dark-label-2 lg:inline-block">
            {weekLabel(startDate, today)}
          </Link>
        )}
      </div>

      {/* Mobile */}
      <button className="rounded-md p-2 text-dark-gray-7 hover:text-white md:hidden" aria-label="Menu"
        aria-expanded={mobileOpen} onClick={() => setMobileOpen((o) => !o)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
        {due > 0 && !mobileOpen && <span className="absolute ml-3 -mt-5 h-2 w-2 rounded-full bg-dark-pink" />}
      </button>
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-[50px] z-50 border-b border-dark-divider-border-2 bg-black px-4 pb-4 md:hidden">
          {user && <div className="py-2 text-xs text-dark-gray-6">{weekLabel(startDate, today)}</div>}
          {[...MAIN, ...LISTS].map((m) => (
            <Link key={m.href} href={m.href}
              className={`block rounded-md px-3 py-2.5 text-sm ${isActive(pathname, m.href) ? "bg-dark-fill-3 text-white" : "text-dark-gray-7"}`}>
              {m.label}
              {m.href === "/" && due > 0 && <span className="ml-2 text-dark-pink">{due} due</span>}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default AppNav;
