'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MindMap from '../components/mindmap'; // Import the MindMap component

export default function MindMapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileName = searchParams.get('fileName');
  
  interface FileAnalysis {
    overview: string;
    branches: Array<{
      name: string;
      subBranches: string[];
    }>;
  }
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  interface IssueData {
    filename_matches: Array<{
      file_name: string;
      match_score: number;
      download_url: string;
    }>;
  }
  
  const [issueData, setIssueData] = useState<IssueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!fileName) {
      router.push('/dashboard');
      return;
    }

    // Find the latest analysis storage for this file
    const storedItem = Object.keys(localStorage)
      .filter(key => key.endsWith('-analyses'))
      .sort()
      .reverse()
      .find(key => {
        const analyses = JSON.parse(localStorage.getItem(key) || '{}');
        return analyses[fileName];
      });

    if (!storedItem) {
      setIsLoading(false);
      return;
    }

    // Get the analyses and corresponding issue data
    const allAnalyses = JSON.parse(localStorage.getItem(storedItem) || '{}');
    const foundAnalysis = allAnalyses[fileName];
    const dataKey = storedItem.replace('-analyses', '-data');
    const issueData = JSON.parse(localStorage.getItem(dataKey) || '{}');

    if (foundAnalysis) {
      setFileAnalysis(foundAnalysis);
      setIssueData(issueData);
    }
    setIsLoading(false);
  }, [fileName, router]);

  const goBack = () => {
    router.back();
  };

  // Get the file match data for the current file
  const getFileMatch = () => {
    if (!issueData || !issueData.filename_matches) return null;
    return issueData.filename_matches.find(match => match.file_name === fileName) || null;
  };

  const fileMatch = getFileMatch();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#075707] text-xl animate-pulse">Loading mindmap...</div>
      </div>
    );
  }

  if (!fileAnalysis || !fileName) {
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
            Analysis not found for this file. Please go back and try again.
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
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#075707]/40 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#075707]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#075707] font-mono">{fileName}</h1>
              {fileMatch && (
                <a 
                  href={fileMatch.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-[#075707] transition-colors mt-1 inline-block"
                >
                  View Raw File →
                </a>
              )}
            </div>
          </div>
          
          {fileMatch && (
            <div className="text-gray-300 font-mono">
              <span className="text-[#075707]">Match Score:</span> {(fileMatch.match_score * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
      
      {/* File Analysis: Overview */}
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800 mb-6">
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
      <div className="bg-[#0a0a0a] rounded-lg p-6 shadow-inner border border-gray-800">
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