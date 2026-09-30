// Firestore writes resolve only when the server acknowledges them. With the offline
// cache on, a write made offline is already applied locally (the UI updates through
// onSnapshot) but its promise stays pending until the connection returns. settle()
// turns that into an answer the UI can act on right away. No Firebase imports.

export type WriteOutcome = "saved" | "queued";

export interface SettleOptions {
  /** Is the browser online right now? Offline writes are queued immediately. */
  online: () => boolean;
  /** How long to wait for the server before treating the write as queued. */
  waitMs?: number;
  /** Called if a queued write is later rejected (e.g. by security rules). */
  onLateError?: (e: unknown) => void;
}

export function settle(write: Promise<unknown>, { online, waitMs = 4000, onLateError }: SettleOptions): Promise<WriteOutcome> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const queued = new Promise<WriteOutcome>((resolve) => {
    if (!online()) resolve("queued");
    else timer = setTimeout(() => resolve("queued"), waitMs);
  });
  const saved = write.then((): WriteOutcome => "saved");
  return Promise.race([saved, queued]).then((outcome) => {
    if (timer) clearTimeout(timer);
    if (outcome === "queued") saved.catch((e) => onLateError?.(e));
    return outcome;
  });
}
