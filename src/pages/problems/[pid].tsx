import React from "react";
import Workspace from "@/components/workspace/Workspace";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problems";
import useHasMounted from "@/components/hooks/useHasMounted";
import TopBar from "@/components/TopBar/TopBar";
type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return null;
  }
  return (
    <div>
      <TopBar problemPage />
      <Workspace problem={problem} />
    </div>
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
  if (!problems) {
    return {
      notFound: true,
    };
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}
