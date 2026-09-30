import React from "react";

/** Full-screen placeholder while sign-in resolves. Pure CSS, so it costs nothing to load. */
const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-black" role="status" aria-live="polite">
    <span className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-400 motion-reduce:animate-none" />
    <span className="sr-only">Loading…</span>
  </div>
);

export default PageLoader;
