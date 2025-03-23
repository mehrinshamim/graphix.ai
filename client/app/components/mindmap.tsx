import React from 'react';

interface Branch {
  name: string;
  subBranches: string[];
}

interface FileAnalysis {
  overview: string;
  branches: Branch[];
}

interface MindMapProps {
  fileName: string;
  analysis?: FileAnalysis;
}

const MindMap: React.FC<MindMapProps> = ({ fileName, analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-[#0f0f0f] rounded-lg p-4 flex items-center justify-center border border-gray-800 h-64">
        <div className="text-[#075707] animate-pulse">Analyzing file...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
      <h3 className="text-xl font-semibold text-[#075707] mb-4 font-mono">{fileName}</h3>
      
     
      
      {/* Mindmap Visualization */}
      <div className="overflow-auto">
        <div className="flex justify-center p-6 bg-black/50 rounded-md border border-gray-800">
          <div className="mindmap">
            {/* Root Node (Filename) */}
            <div className="root-node">
              <div className="node-content bg-[#075707] text-white font-mono px-4 py-2 rounded-md">
                {fileName}
              </div>
              
              {/* Branches */}
              <div className="branches mt-8 flex flex-wrap justify-center">
                {analysis.branches.map((branch, index) => (
                  <div key={index} className="branch mx-6 mb-6">
                    {/* Draw line from root to branch */}
                    <div className="line-to-branch h-8 w-px bg-[#075707]/70 mx-auto mb-1"></div>
                    
                    {/* Branch Node */}
                    <div className="branch-node">
                      <div className="node-content bg-[#0d3d0d] text-[#75d775] font-mono px-3 py-1 rounded-md text-center">
                        {branch.name}
                      </div>
                      
                      {/* Sub-branches */}
                      {branch.subBranches.length > 0 && (
                        <div className="sub-branches mt-6 grid gap-4" 
                             style={{ 
                               gridTemplateColumns: `repeat(${Math.min(branch.subBranches.length, 3)}, minmax(0, 1fr))` 
                             }}>
                          {branch.subBranches.map((subBranch, subIndex) => (
                            <div key={subIndex} className="sub-branch">
                              {/* Draw line from branch to sub-branch */}
                              <div className="line-to-subbranch h-6 w-px bg-[#075707]/50 mx-auto mb-1"></div>
                              
                              {/* Sub-branch Node */}
                              <div className="node-content bg-black border border-[#075707]/70 text-gray-400 font-mono px-2 py-1 rounded-md text-center text-xs">
                                {subBranch}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap;