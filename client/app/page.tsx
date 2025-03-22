'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GitBranch, Zap, Code2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);  
  }, []);

  if (!isMounted) {
    return null; 
  }

  const handleExplore = () => {
    router.push('/explore');
  };

  const handleGetStarted = () => {
    router.push('/guidance');
  };

  return (
    <div className="min-h-screen bg-black shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden relative">
      {/* Matrix Background */}
      <div 
        className="absolute inset-0 bg-black z-0" 
        style={{
          backgroundImage: "url('/assets/bgimg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.9
        }}
      >
        {/* Fallback Matrix effect */}
        <div className="absolute inset-0 bg-[#041105] opacity-80"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF00_1px,transparent_1px),linear-gradient(to_bottom,#00FF00_1px,transparent_1px)] bg-[size:40px_40px] opacity-15"></div>
        </div>
      </div>

      {/* Background icons */}
      <div className="absolute top-20 right-20 opacity-20 max-md:hidden">
        <GitBranch size={100} className="text-green-400" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 max-md:hidden">
        <Code2 size={100} className="text-green-400" />
      </div>

      {/* Radial light effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient pointer-events-none"></div>

      {/* Center content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center z-10 relative">
        <div className="w-full max-w-xl space-y-6">
          {/* Optional Zap icon at top */}
          <div className="flex items-center justify-center space-x-4">
            <Zap className="text-green-400 animate-pulse" size={24} />
            <span className="text-xs uppercase tracking-wider text-green-300 font-josefinSans">
              AI-Powered Debugging Assistant
            </span>
          </div>

          {/* Main title */}
          <div className="flex items-center justify-center">
            <h1 className=" text-6xl md:text-7xl font-bold text-center text-white tracking-wide">
              GRAPHIX.AI
            </h1>
          </div>

          {/* Subtitle */}
          <h2 className="font-josefinSans text-2xl md:text-3xl font-normal text-center text-white/90 mb-4">
            Intelligent Debugging Made Simple
          </h2>

          {/* Description */}
          <p className="font-josefinSans text-lg md:text-xl text-white/80 max-w-md mx-auto text-center mb-12">
            AI-powered issue analysis with graph-based visualization for faster, smarter debugging
          </p>

          {/* Dual button */}
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-[#3c9a4e] to-[#87b694] rounded-full flex overflow-hidden shadow-lg">
              <button 
                onClick={handleExplore}
                className="font-josefinSans text-white px-10 py-4 transition-all duration-300 hover:bg-[#3c9a4e]/20 cursor-pointer"
              >
                Explore
              </button>
              <div className="w-[1px] bg-white/70 my-4"></div>
              <button 
                onClick={handleGetStarted}
                className="font-josefinSans text-white px-10 py-4 transition-all duration-300 hover:bg-[#87b694]/20 cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}