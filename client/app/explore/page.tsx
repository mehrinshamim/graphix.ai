'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, GitBranch, Code2, FileText, Workflow } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./../components/ui/card";


const Features = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/guidance');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A2E] via-[#12254A] to-[#0D1E3A] text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-cyan-400 animate-pulse" size={24} />
            <span className="font-josefinSans text-sm uppercase tracking-wider text-cyan-300">
              Revolutionary Debugging Tool
            </span>
          </div>
          <h1 className="font-noto text-4xl md:text-5xl font-extrabold text-white mb-8">
            TRANSFORM YOUR DEBUGGING EXPERIENCE
          </h1>
          
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20">
            <p className="text-lg text-white/80 leading-relaxed font-josefinSans mb-6">
              Our platform revolutionizes debugging by leveraging AI-powered insights and visualizations. When an issue link is submitted, our NLP model analyzes the report and predicts the top three files most likely causing the error, along with their probability percentages. These insights are then transformed into dynamic mind maps using DALL·E, providing an intuitive graphical breakdown of each file. Developers can explore key components such as endpoints, modules, and dependencies through visually engaging, auto-generated diagrams.
            </p>
            <p className="text-cyan-400 font-josefinSans font-medium mb-8">
              By merging AI-driven analysis with interactive mind maps, our tool simplifies issue tracking and accelerates debugging like never before.
            </p>
            
            <button
              onClick={handleStart}
              className="font-josefinSans bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-xl
              flex items-center justify-center space-x-2 mx-auto
              hover:scale-105 transition-transform duration-300
              shadow-xl hover:shadow-cyan-500/50
              group text-lg"
            >
              <span>Get Started Now</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;