import React from "react";
import Workspace from "@/components/workspace/Workspace";
import { WorkspaceSessionProvider } from "@/components/workspace/WorkspaceSession";
import LogSlideOver from "@/components/workspace/LogSlideOver";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problems";
import TopBar from "@/components/TopBar/TopBar";

type ProblemPageProps = {
  problem: Problem;
  bankKey: string;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem, bankKey }) => {
  // Rendered on the server so the statement shows before JavaScript loads; the
  // editor (which reads saved code and settings from the browser) is client-only.
  return (
    <WorkspaceSessionProvider bankKey={bankKey}>
      <div id="main" tabIndex={-1} className="outline-none">
        <TopBar problemPage />
        <Workspace problem={problem} />
        <LogSlideOver />
      </div>
    </WorkspaceSessionProvider>
  );
};
export default ProblemPage;

export async function getStaticPaths() {
  const paths = Object.keys(problems).map((key) => ({
    params: { pid: key },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const problem = problems[pid];
  if (!problem) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      // Functions can't be serialized to props; the page looks up the handler by key.
      problem: { ...problem, handlerFunction: problem.handlerFunction.toString(), runCases: null },
      bankKey: pid,
    },
  };
}
