// Pure helpers for Google sign-in errors (no Firebase imports, so they're unit-testable).

/** Popup can't open here (blocker, in-app/embedded browser): retry as a full-page redirect. */
const REDIRECT_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/operation-not-supported-in-this-environment",
]);

/** The user closed the popup or clicked twice: not an error worth a toast. */
const SILENT_CODES = new Set(["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"]);

export const shouldFallbackToRedirect = (code?: string) => !!code && REDIRECT_FALLBACK_CODES.has(code);
export const isSilentAuthError = (code?: string) => !!code && SILENT_CODES.has(code);

const MESSAGES: Record<string, string> = {
  "auth/unauthorized-domain": "Google sign-in isn't enabled for this domain.",
  "auth/operation-not-allowed": "Google sign-in is turned off for this app.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/account-exists-with-different-credential": "This email is already registered with a password. Log in with email instead.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
};

/** A toast message that names the actual problem, with the code for anything unmapped. */
export const googleAuthErrorMessage = (code?: string) =>
  (code && MESSAGES[code]) ?? `Google sign-in failed${code ? ` (${code})` : ""}.`;
