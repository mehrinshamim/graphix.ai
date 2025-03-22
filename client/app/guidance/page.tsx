'use client';
import React, { useState } from 'react';
import { MessageSquare, GitBranch, Code2, Search, FileText, Workflow, Github } from 'lucide-react';

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

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
          <div className="relative"></div>
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
          
          <button
            onClick={() => console.log('Analyze clicked')}
            disabled={!githubUsername.trim() || !repoUrl.trim()}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-xl
              hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/50
              disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 mt-10"
          >
            <Search size={20} />
            <span>Analyze Repository</span>
          </button>
        </div>
      </div>
   
  );
};

export default RepositoryAnalyzer;