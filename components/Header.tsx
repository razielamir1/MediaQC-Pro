
import React from 'react';
import type { Theme } from '../types';
import { SunIcon, MoonIcon, HistoryIcon, PlusIcon } from './icons/Icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  onViewHistory: () => void;
  onNewAnalysis: () => void;
  isAnalysisView: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onViewHistory, onNewAnalysis, isAnalysisView }) => {
  return (
    <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          MediaQC Pro
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isAnalysisView && (
            <button
              onClick={onNewAnalysis}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="New Analysis"
              title="New Analysis"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onViewHistory}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="View History"
            title="View History"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
