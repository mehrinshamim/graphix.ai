'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// PieChart component for visualizing match scores (unchanged)
const PieChart = ({ percentage }: { percentage: number }) => {
  const circumference = 2 * Math.PI * 45; // 45 is the radius
  const strokeDashoffset = circumference * (1 - percentage);
  
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45"
          fill="transparent"
          stroke="#0a1f0a"  // Darker background green
          strokeWidth="10"
        />
        {/* Foreground circle - the actual progress */}
        <circle 
          cx="50" 
          cy="50" 
          r="45"
          fill="transparent"
          stroke="#075707"  // Darker foreground green
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{
            filter: "drop-shadow(0 0 6px rgba(7, 87, 7, 0.5))"  // Darker shadow
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#075707] font-mono font-bold text-lg">
          {(percentage * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

// Format description function (unchanged)
const parseDescription = (description: string) => {
  if (!description) return { content: "No description available" };
  
  // Remove markdown asterisks but keep section headers
  const cleanText = description.replace(/\*\*([^*]+)\*\*/g, "$1");
  
  // Parse different sections (based on common GitHub issue template sections)
  const sections = {
    description: '',
    reproduce: '',
    environment: '',
    screenshots: ''
  };
  
  // Find different sections in the description
  const descriptionMatch = cleanText.match(/Describe the bug([\s\S]*?)(?=To Reproduce|$)/i);
  const reproduceMatch = cleanText.match(/To Reproduce([\s\S]*?)(?=Screenshots|Desktop|$)/i);
  const screenshotsMatch = cleanText.match(/Screenshots([\s\S]*?)(?=Desktop|$)/i);
  const environmentMatch = cleanText.match(/Desktop[^:]*:([\s\S]*?)$/i);
  
  if (descriptionMatch && descriptionMatch[1]) sections.description = descriptionMatch[1].trim();
  if (reproduceMatch && reproduceMatch[1]) sections.reproduce = reproduceMatch[1].trim();
  if (screenshotsMatch && screenshotsMatch[1]) sections.screenshots = screenshotsMatch[1].trim();
  if (environmentMatch && environmentMatch[1]) sections.environment = environmentMatch[1].trim();
  
  // If no sections were identified, just return the cleaned text
  if (!sections.description && !sections.reproduce && 
      !sections.environment && !sections.screenshots) {
    return { content: cleanText.trim() };
  }
  
  return sections;
};

interface FileMatch {
  file_name: string;
  download_url: string;
  match_score: number;
}

interface FileAnalysis {
  overview: string;
  branches: Array<{
    name: string;
    subBranches: string[];
  }>;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'));
  console.log("Data:", data);
  
  // State for file analysis results - will be stored in localStorage
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  
  // Parse the description
  const parsedDescription = parseDescription(data.description);

  // Add useEffect to fetch file content when component mounts
  useEffect(() => {
    if (!data.filename_matches || data.filename_matches.length === 0) return;
    
    // Check if we already have analyses stored for this issue in localStorage
    const issueId = data.issue_number || `${data.owner}-${data.repo}-issue`;
    const storedAnalyses = localStorage.getItem(`issue-${issueId}-analyses`);
    
    if (storedAnalyses) {
      console.log("Found stored analyses, no need to fetch again");
      return;
    }
    
    // Initialize analyzing state for each file
    const analyzingState: Record<string, boolean> = {};
    data.filename_matches.forEach((match: FileMatch) => {
      analyzingState[match.file_name] = true;
    });
    setIsAnalyzing(analyzingState);
    
    // Fetch and analyze each file
    const analyses: Record<string, FileAnalysis> = {};
    
    const fetchAllFiles = async () => {
      const fetchPromises = data.filename_matches.map(async (match: FileMatch) => {
        try {
          // Fetch file content
          const response = await fetch(match.download_url);
          const content = await response.text();
          
          // Analyze file content
          const analysisResponse = await fetch('/api/mindmap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName: match.file_name,
              fileExtension: match.file_name.split('.').pop()?.toLowerCase() ?? '',
              content
            }),
          });
          
          const analysisData = await analysisResponse.json();
          analyses[match.file_name] = analysisData;
          
          // Update analyzing state
          setIsAnalyzing(prev => ({
            ...prev,
            [match.file_name]: false
          }));
        } catch (error) {
          console.error(`Error processing file ${match.file_name}:`, error);
          setIsAnalyzing(prev => ({
            ...prev,
            [match.file_name]: false
          }));
        }
      });
      
      await Promise.all(fetchPromises);
      
      // Store analyses in localStorage
      localStorage.setItem(`issue-${issueId}-analyses`, JSON.stringify(analyses));
      localStorage.setItem(`issue-${issueId}-data`, JSON.stringify(data));
      
      console.log("All files processed and stored");
    };
    
    fetchAllFiles();
  }, [data]);

  // Function to navigate to mindmap view
  const viewMindmap = (fileName: string) => {
    router.push(`/mindmap?fileName=${encodeURIComponent(fileName)}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Matrix Background (unchanged) */}
      <div className="w-1/2 relative overflow-hidden bg-black">
        {/* Matrix Background */}
        <div className="absolute inset-0 bg-[#041105] opacity-80"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#075707_1px,transparent_1px),linear-gradient(to_bottom,#075707_1px,transparent_1px)] bg-[size:40px_40px] opacity-15"></div>
        </div>
        
        {/* Matrix falling code effect */}
        <div className="absolute top-0 left-0 w-full opacity-40">
          <div className="font-mono text-[#075707] text-xs opacity-60 z-5 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="whitespace-nowrap" style={{ 
                animation: `fall ${3 + Math.random() * 5}s linear ${Math.random() * 2}s infinite` 
              }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} className="inline-block mx-px">
                    {String.fromCharCode(33 + Math.floor(Math.random() * 93))}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content on the matrix background (unchanged) */}
        <div className="relative z-10 p-12 flex flex-col h-full justify-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-8 border border-[#075707]/30 shadow-xl shadow-[#075707]/10">
            <div className="mb-6">
              <h1 className="text-4xl font-bold font-mono text-[#075707] mb-2 tracking-wide">
                {data.repo || "Repository"}
              </h1>
              <div className="h-1 w-1/3 bg-gradient-to-r from-[#075707] to-transparent rounded-full mb-6"></div>
            </div>
            
            <div className="prose prose-invert">
              <h2 className="text-2xl font-mono font-semibold mb-4 text-gray-300 border-l-4 border-[#075707] pl-4">
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {data.overview || "No overview available"}
              </p>
            </div>
            
            <div className="mt-8 flex items-center space-x-4">
              <div className="p-2 bg-[#075707]/30 rounded-full">
                <div className="w-12 h-12 flex items-center justify-center text-[#075707] bg-[#075707]/50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-[#075707] font-mono">Check out the repo:</h3>
                <a 
                  href={data.repoUrl || `https://github.com/${data.owner}/${data.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-[#075707] transition-colors"
                >
                  {data.repoUrl || `https://github.com/${data.owner}/${data.repo}`}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Plain Black with Issue Details and Matched Files */}
      <div className="w-1/2 bg-black relative overflow-y-auto">
        <div className="p-8 h-full">
          {/* Issue Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#075707] font-mono mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Issue Details
            </h2>
            
            <div className="bg-[#0a0a0a] rounded-lg p-5 shadow-inner border border-gray-800">
              <div className="prose prose-invert">
                {/* Dynamically render different sections based on the parsed description */}
                <div className="space-y-4">
                  {/* If we couldn't parse into sections, just render the whole content */}
                  {typeof parsedDescription === 'object' && 'content' in parsedDescription ? (
                    <div className="text-gray-300 whitespace-pre-wrap bg-black/50 p-4 rounded-md border border-gray-800">
                      {parsedDescription.content}
                    </div>
                  ) : (
                    <>
                      {/* Description Section */}
                      {parsedDescription.description && (
                        <div>
                          <h3 className="text-xl font-semibold text-[#075707] mb-2">Issue</h3>
                          <p className="text-gray-300 whitespace-pre-wrap bg-black/50 p-4 rounded-md border border-gray-800">
                            {parsedDescription.description}
                          </p>
                        </div>
                      )}
                      
                      {/* Reproduction Section */}
                      {parsedDescription.reproduce && (
                        <div>
                          <h3 className="text-xl font-semibold text-[#075707] mb-2">Steps to Reproduce</h3>
                          <div className="text-gray-300 whitespace-pre-wrap bg-black/50 p-4 rounded-md border border-gray-800">
                            {parsedDescription.reproduce}
                          </div>
                        </div>
                      )}
                      
                      {/* Environment Section */}
                      {parsedDescription.environment && (
                        <div>
                          <h3 className="text-xl font-semibold text-[#075707] mb-2">Environment</h3>
                          <div className="text-gray-300 whitespace-pre-wrap bg-black/50 p-4 rounded-md border border-gray-800">
                            {parsedDescription.environment}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Matched Files List */}
          <div>
            <h2 className="text-2xl font-bold text-[#075707] font-mono mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
              Matched Files
            </h2>
            
            <div className="bg-[#0a0a0a] rounded-lg p-5 shadow-inner border border-gray-800">
              <div className="space-y-4">
                {data.filename_matches?.map((match: FileMatch, index: number) => (
                  <div key={index} className="bg-[#0f0f0f] rounded-lg p-4 flex items-center justify-between hover:bg-[#075707]/20 transition-colors duration-200 border border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#075707]/40 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#075707]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-300 font-mono">{match.file_name}</h3>
                        <div className="flex space-x-4 mt-1">
                          <a 
                            href={match.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#52b152] hover:text-[#75d775] text-sm inline-block font-mono transition-colors"
                          >
                            View Raw →
                          </a>
                          <button
                            onClick={() => viewMindmap(match.file_name)}
                            className="text-[#52b152] hover:text-[#75d775] text-sm inline-block font-mono transition-colors"
                          >
                            View Mindmap →
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {isAnalyzing[match.file_name] && (
                        <div className="mr-4 text-[#075707] text-sm animate-pulse">
                          Analyzing...
                        </div>
                      )}
                      <PieChart percentage={match.match_score} />
                    </div>
                  </div>
                ))}
                
                {(!data.filename_matches || data.filename_matches.length === 0) && (
                  <div className="text-gray-500 text-center py-6 italic">
                    No file matches found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;