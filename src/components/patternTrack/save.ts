import { toast } from "react-toastify";
import { settle, type WriteOutcome } from "@/lib/patternTrack/writes";

const opts = { theme: "dark", position: "top-center" } as const;

/**
 * Run a Firestore write and tell the user what happened. Offline (or on a very slow
 * connection) the change is already applied locally, so we say it will sync instead
 * of spinning. Throws only if the write fails before that point.
 */
export async function save(write: Promise<unknown>, what: string, savedMessage?: string): Promise<WriteOutcome> {
  const outcome = await settle(write, {
    online: () => (typeof navigator === "undefined" ? true : navigator.onLine),
    onLateError: (e) => {
      console.error(e);
      toast.error(`Couldn't sync the ${what}. It was undone; please try again.`, opts);
    },
  });
  if (outcome === "queued") toast.info(`Saved on this device. The ${what} will sync when you're back online.`, { ...opts, autoClose: 3000 });
  else if (savedMessage) toast.success(savedMessage, { ...opts, autoClose: 2000 });
  return outcome;
}
