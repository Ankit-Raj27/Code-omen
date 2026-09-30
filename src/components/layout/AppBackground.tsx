import React from "react";

/**
 * Soft colour glows behind the content (purple top-left, blue top-right) and a faint
 * dot grid, echoing the landing page's neon accents. Static; sits inside a black,
 * relatively positioned page wrapper so it covers the full scroll height.
 */
const AppBackground: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-purple-600/15 blur-[120px]" />
    <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[120px]" />
    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:22px_22px]" />
  </div>
);

export default AppBackground;
