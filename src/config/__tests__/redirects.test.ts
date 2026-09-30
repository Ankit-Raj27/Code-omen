import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { redirects } from "../redirects.mjs";

const pagesDir = path.resolve(__dirname, "../../pages");
const pageExists = (route: string) => {
  const rel = route === "/" ? "index" : route.replace(/^\//, "");
  return ["", "/index"].some((suffix) =>
    ["tsx", "ts"].some((ext) => fs.existsSync(path.join(pagesDir, `${rel}${suffix}.${ext}`))),
  );
};

describe("redirects", () => {
  it("covers every old Pattern Track tab plus the bare route", () => {
    const tabs = redirects.flatMap((r) => r.has?.map((h) => h.value) ?? ["(none)"]);
    expect(tabs.sort()).toEqual(["(none)", "log", "method", "roadmap", "today"]);
  });
  it("puts the catch-all last so ?tab= rules win", () => {
    expect(redirects.at(-1)?.has).toBeUndefined();
  });
  it("points only at pages that exist, and the old page is gone", () => {
    for (const r of redirects) expect(pageExists(r.destination), r.destination).toBe(true);
    expect(pageExists("/pattern-track")).toBe(false);
  });
});
