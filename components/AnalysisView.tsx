
import React from 'react';
import type { AnalysisResult } from '../types';
import { TabView } from './TabView';
import { ComparisonView } from './ComparisonView';
import { LoaderIcon } from './icons/Icons';

interface AnalysisViewProps {
  results: AnalysisResult[];
  isLoading: boolean;
  onNewAnalysis: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ results, isLoading, onNewAnalysis }) => {
  if (isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-fadeIn">
        <LoaderIcon className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg">Analyzing files, please wait...</p>
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="text-center">
        <p>No analysis results to display.</p>
        <button onClick={onNewAnalysis} className="mt-4 bg-primary text-white px-4 py-2 rounded-md">
          Start New Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {results.length === 1 ? (
        <TabView result={results[0]} />
      ) : (
        <ComparisonView results={results} />
      )}
    </div>
  );
};
