import React, { useEffect, useState } from "react";

/** A slim notice while the browser is offline. Grading and logging keep working from the local cache. */
const OfflineBanner: React.FC = () => {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-[60] bg-amber-500/95 px-4 py-2 text-center text-sm font-medium text-black">
      You&apos;re offline. Reviews and logs are saved on this device and will sync when you reconnect.
    </div>
  );
};

export default OfflineBanner;
