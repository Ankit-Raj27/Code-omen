import React from 'react';
import TopBar from '../../components/topBar/TopBar';
import Workspace from '@/components/workspace/Workspace';
type ProblemPageProps = {
    
};

const ProblemPage:React.FC<ProblemPageProps> = () => {
    
    return <div>
        <TopBar problemPage/>
        <Workspace />
    </div>
}
export default ProblemPage; 