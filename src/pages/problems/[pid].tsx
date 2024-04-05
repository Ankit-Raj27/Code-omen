import React from "react";
import TopBar from "../../components/topBar/Topbar";
import Workspace from "@/components/workspace/Workspace";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problems";
type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  console.log(problem);
  return (
    <div>
      <TopBar problemPage />
      <Workspace problem={problem} />
    </div>
  );
};
export default ProblemPage;

//fetch the local data
//Static site generation
// getStaticPath =? creates dynamic routes

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
