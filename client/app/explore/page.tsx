'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, GitBranch, Code2, FileText, Workflow } from 'lucide-react';
import Image from 'next/image';

const ExplorePage = () => {
  const router = useRouter();
  
  const handleStart = () => {
    router.push('/guidance');
  };
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
        {/* Fallback Matrix effect if image doesn't work properly */}
        <div className="absolute inset-0 bg-[#041105] opacity-80"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF00_1px,transparent_1px),linear-gradient(to_bottom,#00FF00_1px,transparent_1px)] bg-[size:40px_40px] opacity-15"></div>
        </div>
      </div>

      {/* Coding Related Work on Sides - Command Lines */}
      {/* Moved to left top */}
      <div className="absolute top-16 left-4 w-1/3 text-green-500 font-mono text-xs opacity-60 z-5 max-md:hidden">
        <div>$ git clone https://github.com/user/repo.git</div>
        <div>$ cd repo</div>
        <div>$ npm install</div>
        <div>$ git checkout -b feature</div>
        <div>$ git add .</div>
        <div>$ git commit -m "Add new feature"</div>
        <div>$ git push origin feature</div>
      </div>

      {/* Moved to right bottom */}
      <div className="absolute bottom-16 right-4 w-1/3 text-green-500 font-mono text-xs opacity-60 z-5 max-md:hidden">
        <div>64 bytes from 173.194.193.0: time=15.277 ms</div>
        <div>64 bytes from 173.194.193.0: time=14.928 ms</div>
        <div>64 bytes from 173.194.193.0: time=15.123 ms</div>
        <div>$ sudo npm run build</div>
        <div>$ docker-compose up -d</div>
        <div>$ kubectl apply -f deployment.yaml</div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 mt-40">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-green-400 animate-pulse" size={24} />
            <span className="font-josefinSans  text-sm uppercase tracking-wider text-green-300 mt-5">
              Revolutionary Debugging Tool
            </span>
          </div>
          <h1 className="font-josefinSans text-4xl md:text-5xl font-extrabold text-white mb-8">
            TRANSFORM YOUR DEBUGGING EXPERIENCE
          </h1>
          
          {/* Reduced width of center box */}
          <div className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
            <p className="font-josefinSans text-lg text-white/80 leading-relaxed  mb-6">
              Our platform revolutionizes debugging by leveraging AI-powered insights and visualizations. When an issue link is submitted, our NLP model analyzes the report and predicts the top three files most likely causing the error, along with their probability percentages.
            </p>
            <p className="font-josefinSans text-green-400 font-medium mb-8">
              By merging AI-driven analysis with interactive mind maps, our tool simplifies issue tracking and accelerates debugging like never before.
            </p>
            
            <button
              onClick={handleStart}
              className="font-mono bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-xl
              flex items-center justify-center space-x-2 mx-auto
              hover:scale-105 transition-transform duration-300
              shadow-xl hover:shadow-green-500/50 cursor-pointer
              group text-lg"
            >
              <span className='font-josefinSans'>Get Started Now</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;