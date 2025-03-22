'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const data = JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analysis Results</h1>
        
        {/* Repository Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Repository: {data.repo}</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="whitespace-pre-wrap">{data.description}</p>
          </div>
        </div>

        {/* Matched Files */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Matched Files</h2>
          <div className="space-y-4">
            {data.filename_matches?.map((match: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{match.file_name}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Match Score: {(match.match_score * 100).toFixed(1)}%
                  </span>
                </div>
                <a 
                  href={match.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
