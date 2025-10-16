import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { TABS } from '../constants';
import { MetadataTable } from './MetadataTable';
import { QCSummaryPanel } from './QCSummaryPanel';
import { handleExport } from '../services/exportManager';
import { ExportIcon } from './icons/Icons';
import { ExportFormat } from '../types';
import { EncodeSetView } from './EncodeSetView';

interface TabViewProps {
  result: AnalysisResult;
}

export const TabView: React.FC<TabViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const renderContent = () => {
    switch (activeTab) {
      case 'QC Summary':
        return <QCSummaryPanel issues={result.qcIssues} summary={result.qcSummary} />;
      case 'EncodeSet':
        return <EncodeSetView results={[result]} />;
      case 'General':
        return <MetadataTable title="General" data={result.mediaInfo.general} />;
      case 'Video':
        return result.mediaInfo.video ? <MetadataTable title="Video Stream" data={result.mediaInfo.video} /> : <p>No video stream found.</p>;
      case 'Audio':
        return result.mediaInfo.audio.length > 0 ? (
          result.mediaInfo.audio.map((track, index) => (
            <MetadataTable key={index} title={`Audio Stream #${index + 1}`} data={track} />
          ))
        ) : <p>No audio streams found.</p>;
      case 'Subtitles':
        return result.mediaInfo.subtitles.length > 0 ? (
          result.mediaInfo.subtitles.map((track, index) => (
            <MetadataTable key={index} title={`Subtitle Stream #${index + 1}`} data={track} />
          ))
        ) : <p>No subtitle streams found.</p>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold truncate" title={result.fileName}>{result.fileName}</h2>
        <div className="relative group">
            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-sky-600 dark:hover:bg-sky-400 transition-colors">
                <ExportIcon className="w-5 h-5" />
                <span>Export</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible z-20">
                <a onClick={() => handleExport(result, ExportFormat.JSON)} className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">Export as JSON</a>
                <a onClick={() => handleExport(result, ExportFormat.XML)} className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">Export as XML</a>
                <a onClick={() => handleExport(result, ExportFormat.CSV)} className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">Export as CSV</a>
                <a onClick={() => handleExport(result, ExportFormat.Text)} className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">Export as Text Summary</a>
            </div>
        </div>
      </div>

      <div className="border-b border-border-light dark:border-border-dark mb-4">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-text-light dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};