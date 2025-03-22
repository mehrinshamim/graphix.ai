'use client';
import React, { useState } from 'react';
import { GitBranch, Code2, Search, FileText, Workflow } from 'lucide-react';
import fetchDetails from '../utils/fetch/issuerep_det';

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
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
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A2E] via-[#12254A] to-[#0D1E3A] p-8 relative overflow-hidden font-josefinSans">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 ">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1A2E_1px,transparent_1px),linear-gradient(to_bottom,#0B1A2E_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-20 right-20 opacity-20 max-md:hidden">
        <GitBranch size={100} className="text-cyan-500" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 max-md:hidden">
        <Code2 size={100} className="text-cyan-500" />
      </div>
      <div className="absolute top-1/3 left-20 opacity-20 max-md:hidden">
        <FileText size={80} className="text-cyan-500" />
      </div>
      <div className="absolute bottom-1/3 right-20 opacity-20 max-md:hidden">
        <Workflow size={80} className="text-cyan-500" />
      </div>

      <div className="max-w-2xl mx-auto mt-20 bg-[#162544]/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500/20 relative z-10">
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <Search className="text-cyan-400" size={40} />
            <h1 className="text-4xl font-bold text-white">Repository Analysis</h1>
          </div>
          <p className="text-xl text-white/70">
            Enter your GitHub details to get started
          </p>
        </div>

        <div className="space-y-6">
          {/* GitHub Username Input */}
          <div className="relative">
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="w-full pl-12 p-4 rounded-xl bg-[#1E2B43]/50 border border-cyan-500/20 text-white 
                focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent"
            />
          </div>

          {/* GitHub Issue URL Input */}
          <div className="relative mt-10">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo/issues/number"
              className="w-full pl-12 p-4 rounded-xl bg-[#1E2B43]/50 border border-cyan-500/20 text-white 
                focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent"
            />
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200">
              {error}
            </div>
          )}
          
          <button
            onClick={() => handleAnalyze()}
            disabled={!githubUsername.trim() || !repoUrl.trim() || loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-xl
              hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/50
              disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 mt-10"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Search size={20} />
                <span>Analyze Repository</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepositoryAnalyzer;