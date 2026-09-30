import { describe, expect, it, vi } from "vitest";
import { settle } from "../writes";

const never = () => new Promise<void>(() => {});

describe("settle (offline-safe writes)", () => {
  it("reports saved when the server acknowledges in time", async () => {
    await expect(settle(Promise.resolve(), { online: () => true })).resolves.toBe("saved");
  });
  it("rethrows an error that arrives while waiting", async () => {
    await expect(settle(Promise.reject(new Error("denied")), { online: () => true })).rejects.toThrow("denied");
  });
  it("queues immediately when offline", async () => {
    await expect(settle(never(), { online: () => false })).resolves.toBe("queued");
  });
  it("queues after the wait when the server is slow", async () => {
    vi.useFakeTimers();
    const p = settle(never(), { online: () => true, waitMs: 1000 });
    vi.advanceTimersByTime(1000);
    await expect(p).resolves.toBe("queued");
    vi.useRealTimers();
  });
  it("reports a queued write that is rejected later", async () => {
    let reject!: (e: unknown) => void;
    const write = new Promise<void>((_, r) => { reject = r; });
    const onLateError = vi.fn();
    await expect(settle(write, { online: () => false, onLateError })).resolves.toBe("queued");
    reject(new Error("rules"));
    await new Promise((r) => setTimeout(r, 0));
    expect(onLateError).toHaveBeenCalledOnce();
  });
});
