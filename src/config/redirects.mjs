// Old Pattern Track URLs → the routes that replaced them (Phase 1).
// Specific ?tab= rules come before the catch-all. Permanent: bookmarks should update.
const tab = (value) => [{ type: "query", key: "tab", value }];

export const redirects = [
  { source: "/pattern-track", has: tab("today"), destination: "/", permanent: true },
  { source: "/pattern-track", has: tab("roadmap"), destination: "/patterns", permanent: true },
  { source: "/pattern-track", has: tab("log"), destination: "/log", permanent: true },
  { source: "/pattern-track", has: tab("method"), destination: "/method", permanent: true },
  { source: "/pattern-track", destination: "/", permanent: true },
];
