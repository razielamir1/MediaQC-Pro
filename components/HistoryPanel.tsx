
import React from 'react';
import type { AnalysisResult } from '../types';
import { QCSeverity } from '../types';
import { CheckCircleIcon, WarningIcon, ErrorIcon, TrashIcon, RedoIcon, ArrowLeftIcon } from './icons/Icons';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onClear: () => void;
  onReanalyze: (result: AnalysisResult) => void;
  onBack: () => void;
}

const getStatus = (result: AnalysisResult) => {
  if (result.qcIssues.some(issue => issue.severity === QCSeverity.Error)) {
    return { icon: <ErrorIcon className="w-5 h-5 text-danger" />, text: 'Fail' };
  }
  if (result.qcIssues.some(issue => issue.severity === QCSeverity.Warning)) {
    return { icon: <WarningIcon className="w-5 h-5 text-warning" />, text: 'Warning' };
  }
  return { icon: <CheckCircleIcon className="w-5 h-5 text-success" />, text: 'Pass' };
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onReanalyze, onBack }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-lg shadow-md animate-fadeIn">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center space-x-2">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeftIcon className="w-5 h-5"/>
            </button>
            <h2 className="text-xl font-bold">Analysis History</h2>
        </div>
        <button onClick={onClear} disabled={history.length === 0} className="flex items-center space-x-2 bg-danger text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
          <TrashIcon className="w-5 h-5" />
          <span>Clear History</span>
        </button>
      </div>
      {history.length === 0 ? (
        <p className="text-center text-secondary py-8">No analysis history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-2 font-semibold">File Name</th>
                <th className="p-2 font-semibold">Timestamp</th>
                <th className="p-2 font-semibold">Status</th>
                <th className="p-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => {
                const status = getStatus(item);
                return (
                  <tr key={item.id} className="border-b border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-2 truncate" title={item.fileName}>{item.fileName}</td>
                    <td className="p-2 text-sm text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {status.icon}
                        <span>{status.text}</span>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <button onClick={() => onReanalyze(item)} title="Re-analyze" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        <RedoIcon className="w-5 h-5 text-primary" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
