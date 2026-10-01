import Link from "next/link";
import PageFrame from "@/components/layout/PageFrame";
import { Panel, btnGradient, btnGhost } from "@/components/patternTrack/ui";

export default function NotFound() {
  return (
    <PageFrame title="Page not found" subtitle="That link doesn't lead anywhere in CodeOmen.">
      <Panel className="max-w-xl">
        <p className="text-sm text-dark-label-2">If you followed an old problem link, the problem may have a new address. Find it from its pattern.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/" className={btnGradient}>Go to Today</Link>
          <Link href="/patterns" className={btnGhost}>Browse patterns</Link>
        </div>
      </Panel>
    </PageFrame>
  );
}
