import React from "react";
import Split from "react-split";
import ProblemDescription from "./problemDesc/ProblemDescription";
import Playground from "./playground/Playground";
type WorkspaceProps = {};

const Workspace: React.FC<WorkspaceProps> = () => {
  return (
    <Split className="split" minSize={0}>
      <ProblemDescription />
      <Playground />
    </Split>
  );
};
export default Workspace;
