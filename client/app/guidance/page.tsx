'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import fetchDetails from '../utils/fetch/issuerep_det';

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching details for:', repoUrl);
      const data = await fetchDetails(repoUrl);

      if (data && data.matchedFiles) {
        const urlParts = repoUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        const issueNumber = urlParts[6];

        const issueResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`);
        const issueData = await issueResponse.json();
        // Handle the response data here
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Mindmap Image */}
      <div className="w-1/2 h-full bg-gray-100 relative">
        <Image 
          src="/assets/mindmap.png" 
          alt="Repository Mindmap" 
          layout="fill" 
          objectFit="cover"
          priority
        />
      </div>

      {/* Right Side - Matrix Background with Form */}
      <div className="w-1/2 h-full relative overflow-hidden">
        {/* Matrix Background Base Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-black to-[#072b07]"></div>
        
        {/* Matrix Digital Rain Effect */}
        <div className="absolute inset-0 z-0 opacity-50">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.2))",
              backgroundSize: "100% 2px"
            }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF00_1px,transparent_1px),linear-gradient(to_bottom,#00FF00_1px,transparent_1px)] bg-[size:20px_30px] opacity-25"></div>
        </div>
        
        {/* Animated Matrix Code Text */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="opacity-40">
            <div className="absolute top-5 left-5 font-mono text-green-400 text-xs animate-pulse">
              $ git clone https://github.com/user/repo.git<br />
              $ cd repo<br />
              $ npm install<br />
              $ git checkout -b feature<br />
              $ git commit -m "Fix issue #123"<br />
              $ git push origin feature<br />
            </div>
            <div className="absolute top-5 right-10 font-mono text-green-400 text-xs">
              64 bytes from 173.194.113.0: time=0.25 ms<br />
              64 bytes from 173.194.113.0: time=0.28 ms<br />
              $ npm test<br />
              $ docker-compose up<br />
              $ kubectl apply -f deployment.yaml<br />
            </div>
            <div className="absolute bottom-20 left-10 font-mono text-green-400 text-xs">
              import React from &apos;react&apos;;<br />
              function App() {'{'};<br />
              &nbsp;&nbsp;return (<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;Hello World&lt;/div&gt;/div&gt;<br />
              &nbsp;&nbsp;);<br />
              {'}'}<br />
            </div>
            <div className="absolute bottom-20 right-20 font-mono text-green-400 text-xs">
              $ curl -X POST api.github.com<br />
              $ npm run build<br />
              $ git merge --squash<br />
              $ aws s3 sync ./build<br />
              $ heroku push main<br />
            </div>
          </div>
        </div>

        {/* Glowing GitHub Circle in Background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-900/20 blur-3xl"></div>

        {/* Form Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 py-12">
          {/* GitHub Logo and Title */}
          <div className="flex items-center mb-6">
            <svg className="w-10 h-10 text-white mr-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <h1 className="font-noto text-white text-2xl font-bold uppercase tracking-wider">Repository and Issue Matcher</h1>
          </div>

          {/* Description Text */}
          <div className="w-full max-w-md mb-10">
            <p className="font-noto text-white text-lg mb-10">
              Enter your details below to discover tailored open-source issues that match your skills and interests.
            </p>
          </div>

          {/* Form Fields */}
          <div className="w-full max-w-md space-y-8">
            {/* GitHub Username Input */}
            <div className="space-y-2">
              <label className="font-josefinSans block text-white text-xl font-medium mb-2">
                Github Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="Enter your GitHub username"
                  className="w-full bg-gray-800/50 border border-green-900/30 text-white placeholder-gray-400 rounded-md py-3 pl-10 focus:ring-2 focus:ring-green-500 focus:bg-gray-800/80"
                />
              </div>
            </div>

            {/* Repository Link Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="Enter the repository link"
                  className="w-full bg-gray-800/50 border border-green-900/30 text-white placeholder-gray-400 rounded-md py-3 pl-10 focus:ring-2 focus:ring-green-500 focus:bg-gray-800/80"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-md bg-red-500/20 border border-red-500/40 text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!githubUsername.trim() || !repoUrl.trim() || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md
                transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <span className='font-josefinSans'>Analyze Repository</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryAnalyzer;