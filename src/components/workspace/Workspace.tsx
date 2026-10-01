import React, { useEffect, useState } from "react";
import Split from "react-split";
import ProblemDescription from "./problemDesc/ProblemDescription";
import dynamic from "next/dynamic";

// Reads saved code, language and font size from localStorage, so it renders on the client only.
const Playground = dynamic(() => import("./playground/Playground"), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-50px)] animate-pulse bg-dark-layer-1 motion-reduce:animate-none" aria-label="Loading editor" />,
});
import { Problem } from "@/utils/types/problems";
import Confetti from "react-confetti";
import useWindowSize from "../hooks/useWindowSize";

type WorkspaceProps = {
  problem: Problem;
};

/** Below this width the two panels don't fit side by side. */
const NARROW = 768;

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  // Desktop gets the draggable split once mounted. Before that (and on phones) the layout is
  // plain CSS, so the server render already matches the screen and nothing shifts.
  const [desktop, setDesktop] = useState(false);
  const [pane, setPane] = useState<"problem" | "code">("problem");
  useEffect(() => setDesktop(width >= NARROW), [width]);

  const description = <ProblemDescription problem={problem} _solved={solved} />;
  const editor = (
    <div>
      <Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} />
      {success && <Confetti gravity={0.3} tweenDuration={2000} width={width - 1} height={height - 1} />}
    </div>
  );

  if (desktop) {
    return (
      <Split className="split" minSize={0}>
        {description}
        {editor}
      </Split>
    );
  }

  // Phones: one panel at a time. Both stay mounted so code and timer survive switching.
  return (
    <div className="md:flex">
      <div role="group" aria-label="Show" className="flex gap-1 border-b border-dark-divider-border-2 bg-dark-layer-2 p-1.5 md:hidden">
        {(["problem", "code"] as const).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={pane === p}
            onClick={() => setPane(p)}
            className={`min-h-[44px] flex-1 rounded-md text-sm font-medium capitalize ${
              pane === p ? "bg-dark-fill-2 text-white" : "text-dark-gray-6 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className={`${pane === "problem" ? "" : "hidden"} md:block md:w-1/2`}>{description}</div>
      <div className={`${pane === "code" ? "" : "hidden"} md:block md:w-1/2`}>{editor}</div>
    </div>
  );
};
export default Workspace;
