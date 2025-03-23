import React, { useRef } from 'react';
import { Button } from '../components/ui/button';
import { Download } from 'lucide-react';
import { exportMindmapAsPng } from '../lib/mindmap';

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
  const mindmapRef = useRef<HTMLDivElement>(null);
  
  if (!analysis) {
    return (
      <div className="font-josefinSans bg-[#0f0f0f] rounded-lg p-4 flex items-center justify-center border border-gray-800 h-64">
        <div className="font-josefinSans text-[#008000] animate-pulse">Analyzing file...</div>
      </div>
    );
  }
  
  const handleExport = async () => {
    if (!mindmapRef.current) return;
    await exportMindmapAsPng(mindmapRef.current, fileName);
  };

  return (
    <div className="font-josefinSans bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
      {/* Export Button */}
      <div className="flex justify-end mb-2">
        <Button 
          onClick={handleExport}
          variant="outline" 
          size="sm"
          className="bg-[#1a331a] text-[#4caf50] border-[#2e572e] hover:bg-[#2e572e] hover:text-white justify-center items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Export as PNG
        </Button>
      </div>
      
      {/* Mindmap Visualization */}
      <div className="overflow-auto">
        <div 
          ref={mindmapRef} 
          className="flex justify-center p-6 bg-black/50 rounded-md border border-gray-800"
        >
          <div className="mindmap">
            {/* Root Node (Filename) */}
            <div className="root-node">
              <div className="node-content bg-[#2e572e] text-white font-mono px-4 py-2 rounded-md">
                {fileName}
              </div>
              
              {/* Branches */}
              <div className="branches mt-8 flex flex-wrap justify-center">
                {analysis.branches.map((branch, index) => (
                  <div key={index} className="branch mx-6 mb-6">
                    {/* Draw line from root to branch */}
                    <div className="line-to-branch h-8 w-px bg-[#2e572e]/70 mx-auto mb-1"></div>
                    
                    {/* Branch Node */}
                    <div className="branch-node">
                      <div className="node-content bg-[#1a331a] text-[#4caf50] font-mono px-3 py-1 rounded-md text-center">
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
                              <div className="line-to-subbranch h-6 w-px bg-[#2e572e]/50 mx-auto mb-1"></div>
                              
                              {/* Sub-branch Node */}
                              <div className="node-content bg-black border border-[#2e572e]/70 text-gray-400 font-mono px-2 py-1 rounded-md text-center text-xs">
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