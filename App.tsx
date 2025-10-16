
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { AnalysisView } from './components/AnalysisView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { parseFile } from './services/mediaParser';
import { analyzeQC } from './services/qcAnalyzer';
import { generateQCSummary } from './services/geminiService';
import type { AnalysisResult, Theme } from './types';
import { HistoryPanel } from './components/HistoryPanel';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('mediaqc-history', []);
  const [activeView, setActiveView] = useState<'upload' | 'analysis' | 'history'>('upload');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFiles = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const results: AnalysisResult[] = await Promise.all(
        files.map(async (file) => {
          const mediaInfo = await parseFile(file);
          const qcIssues = analyzeQC(mediaInfo);
          const geminiSummaryPromise = generateQCSummary(qcIssues);
          const geminiSummary = await geminiSummaryPromise;

          const result: AnalysisResult = {
            id: `${file.name}-${new Date().toISOString()}`,
            fileName: file.name,
            timestamp: new Date().toISOString(),
            mediaInfo,
            qcIssues,
            qcSummary: geminiSummary,
          };
          return result;
        })
      );
      
      setAnalysisResults(results);
      setHistory(prevHistory => [...results, ...prevHistory]);
      setActiveView('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      setActiveView('upload');
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  const handleViewHistory = () => {
    setActiveView('history');
  };
  
  const handleShowUpload = () => {
    setAnalysisResults([]);
    setActiveView('upload');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleReanalyzeFromHistory = (result: AnalysisResult) => {
    setAnalysisResults([result]);
    setActiveView('analysis');
  };

  const renderContent = () => {
    if (activeView === 'history') {
      return <HistoryPanel 
        history={history} 
        onClear={handleClearHistory}
        onReanalyze={handleReanalyzeFromHistory} 
        onBack={() => setActiveView(analysisResults.length > 0 ? 'analysis' : 'upload')}
        />;
    }
    
    if (isLoading || analysisResults.length > 0) {
      return (
        <AnalysisView 
          results={analysisResults} 
          isLoading={isLoading} 
          onNewAnalysis={handleShowUpload}
        />
      );
    }

    return <UploadZone onFilesSelected={handleFiles} isLoading={isLoading} error={error} />;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onViewHistory={handleViewHistory}
        isAnalysisView={activeView === 'analysis' || activeView === 'history'}
        onNewAnalysis={handleShowUpload}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500 dark:text-gray-400">
        <p>MediaQC Pro - Advanced Analysis Tool</p>
      </footer>
    </div>
  );
};

export default App;
