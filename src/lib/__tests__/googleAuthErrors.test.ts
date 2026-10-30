import { describe, expect, it } from "vitest";
import { googleAuthErrorMessage, isSilentAuthError, shouldFallbackToRedirect } from "../googleAuthErrors";

describe("Google sign-in error handling", () => {
  it("falls back to redirect when the popup is blocked", () => {
    expect(shouldFallbackToRedirect("auth/popup-blocked")).toBe(true);
    expect(shouldFallbackToRedirect("auth/operation-not-supported-in-this-environment")).toBe(true);
    expect(shouldFallbackToRedirect("auth/unauthorized-domain")).toBe(false);
    expect(shouldFallbackToRedirect(undefined)).toBe(false);
  });

  it("stays quiet when the user closes the popup", () => {
    expect(isSilentAuthError("auth/popup-closed-by-user")).toBe(true);
    expect(isSilentAuthError("auth/cancelled-popup-request")).toBe(true);
    expect(isSilentAuthError("auth/popup-blocked")).toBe(false);
  });

  it("names the problem, and shows the code for unknown errors", () => {
    expect(googleAuthErrorMessage("auth/unauthorized-domain")).toMatch(/domain/);
    expect(googleAuthErrorMessage("auth/internal-error")).toBe("Google sign-in failed (auth/internal-error).");
    expect(googleAuthErrorMessage()).toBe("Google sign-in failed.");
  });
});
