'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MindMap from '../components/mindmap'; // Import the MindMap component

export default function MindMapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileName = searchParams.get('fileName');
  const analysisParam = searchParams.get('analysis');
  
  interface FileAnalysis {
    overview: string;
    branches: Array<{
      name: string;
      subBranches: string[];
    }>;
  }
  
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get file match details from URL parameters if available
  const matchScoreParam = searchParams.get('matchScore');
  const downloadUrlParam = searchParams.get('downloadUrl');

  useEffect(() => {
    if (!fileName) {
      router.push('/dashboard');
      return;
    }

    // Parse the analysis data from URL parameters
    if (analysisParam) {
      try {
        const parsedAnalysis = JSON.parse(decodeURIComponent(analysisParam));
        setFileAnalysis(parsedAnalysis);
      } catch (err) {
        console.error('Failed to parse analysis data:', err);
        setError('Failed to load mindmap data. Please go back and try again.');
      }
    } else {
      setError('No analysis data provided. Please go back and try again.');
    }
    
    setIsLoading(false);
  }, [fileName, analysisParam, router]);

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#075707] text-xl animate-pulse">Loading mindmap...</div>
      </div>
    );
  }

  if (error || !fileAnalysis || !fileName) {
    return (
      <div className="min-h-screen bg-black p-8">
        <button 
          onClick={goBack}
          className="bg-[#075707]/20 hover:bg-[#075707]/40 text-[#075707] px-4 py-2 rounded-md mb-8 flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <div className="bg-[#0a0a0a] rounded-lg p-8 shadow-inner border border-gray-800">
          <div className="text-gray-500 text-center py-6">
            {error || "Analysis not found for this file. Please go back and try again."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Back button */}
      <button 
        onClick={goBack}
        className="bg-[#075707]/20 hover:bg-[#075707]/40 text-[#075707] px-4 py-2 rounded-md mb-8 flex items-center transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>
      
      {/* File header */}
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800 mb-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#075707]/40 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#075707]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#075707] font-mono">
                {fileName.split('/').pop()} {/* Only show the file name, not the full path */}
              </h1>
              {downloadUrlParam && (
                <a 
                  href={downloadUrlParam}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-[#075707] transition-colors mt-1 inline-block"
                >
                  View Raw File →
                </a>
              )}
            </div>
          </div>
          
          {matchScoreParam && (
            <div className="text-gray-300 font-mono text-right">
              <div className="text-[#075707]">Match Score</div>
              <div>{parseFloat(matchScoreParam).toFixed(1)}%</div>
            </div>
          )}
        </div>
      </div>
      
      {/* File Analysis: Overview */}
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800 mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#075707] font-mono mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          Overview
        </h2>
        <div className="bg-black/50 p-4 rounded-md border border-gray-800">
          <p className="text-gray-300">{fileAnalysis.overview}</p>
        </div>
      </div>
      
      {/* Mindmap */}
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#075707] font-mono mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          File Structure Mindmap
        </h2>
        <MindMap fileName={fileName} analysis={fileAnalysis} />
      </div>
    </div>
  );
}