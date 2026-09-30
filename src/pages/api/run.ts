import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import {
  MAX_SOURCE_BYTES, buildJavaSource, hasJava, parseHarnessOutput, type JavaRunResult,
} from "@/lib/javaRunner";

// Judge0 CE via RapidAPI. Key is server-only (no NEXT_PUBLIC_ prefix).
const JUDGE0_HOST = process.env.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_RAPIDAPI_KEY;
const JAVA_LANGUAGE_ID = 62; // Java (OpenJDK 13)

// Best-effort per-instance rate limit: 10 runs / minute / user.
const WINDOW_MS = 60_000;
const MAX_RUNS = 10;
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_RUNS;
}

/** Verify a Firebase ID token via the Identity Toolkit REST API; returns uid. */
async function verifyUser(req: NextApiRequest): Promise<string | null> {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!token || !apiKey) return null;
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data?.users?.[0]?.localId ?? null;
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const unb64 = (s?: string | null) => (s ? Buffer.from(s, "base64").toString("utf8") : "");

export default async function handler(req: NextApiRequest, res: NextApiResponse<JavaRunResult | { error: string }>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!JUDGE0_KEY) return res.status(503).json({ error: "Java runner is not configured" });

  const { problemId, code } = (req.body ?? {}) as { problemId?: unknown; code?: unknown };
  if (typeof problemId !== "string" || typeof code !== "string") {
    return res.status(400).json({ error: "problemId and code are required" });
  }
  if (!hasJava(problemId)) return res.status(404).json({ error: "No Java tests for this problem yet" });
  if (Buffer.byteLength(code, "utf8") > MAX_SOURCE_BYTES) return res.status(413).json({ error: "Code too large" });

  let uid: string | null = null;
  try {
    uid = await verifyUser(req);
  } catch {
    uid = null;
  }
  if (!uid) return res.status(401).json({ error: "Please log in to run Java" });
  if (rateLimited(uid)) return res.status(429).json({ error: "Too many runs — wait a minute" });

  const nonce = crypto.randomBytes(16).toString("hex");
  let source: string;
  try {
    source = buildJavaSource(problemId, code, nonce);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }

  try {
    const r = await fetch(`https://${JUDGE0_HOST}/submissions?base64_encoded=true&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_KEY,
        "X-RapidAPI-Host": JUDGE0_HOST,
      },
      body: JSON.stringify({
        language_id: JAVA_LANGUAGE_ID,
        source_code: b64(source),
        cpu_time_limit: 5,
        wall_time_limit: 10,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (r.status === 429) return res.status(429).json({ error: "Judge quota reached — try again later" });
    if (!r.ok) {
      console.error("Judge0 error", r.status, await r.text().catch(() => ""));
      return res.status(502).json({ error: "Code runner unavailable" });
    }
    const j = await r.json();
    const statusId: number = j?.status?.id ?? 0;
    const stdout = unb64(j.stdout);
    const parsed = parseHarnessOutput(stdout, nonce);

    if (statusId === 6) {
      return res.status(200).json({ status: "compile_error", passed: 0, total: 0, lines: [], message: clip(unb64(j.compile_output)) });
    }
    if (statusId === 5) {
      return res.status(200).json({ status: "time_limit", ...pick(parsed), message: "Time limit exceeded" });
    }
    if (!parsed.done) {
      return res.status(200).json({
        status: statusId >= 7 && statusId <= 12 ? "runtime_error" : "error",
        ...pick(parsed),
        message: clip(unb64(j.stderr) || j?.status?.description || "Run failed"),
      });
    }
    return res.status(200).json({
      status: parsed.passed === parsed.total && parsed.total > 0 ? "accepted" : "wrong_answer",
      ...pick(parsed),
    });
  } catch (e) {
    console.error("Judge0 request failed", e);
    return res.status(504).json({ error: "Code runner timed out" });
  }
}

const pick = (p: ReturnType<typeof parseHarnessOutput>) => ({ passed: p.passed, total: p.total, lines: p.lines.slice(0, 50) });
const clip = (s: string) => (s.length > 4000 ? `${s.slice(0, 4000)}\n…` : s);
