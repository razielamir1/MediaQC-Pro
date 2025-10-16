import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { QCSeverity } from '../types';
import { ChevronDownIcon } from './icons/Icons';
import { EncodeSetView } from './EncodeSetView';

interface ComparisonViewProps {
  results: AnalysisResult[];
}

const getStatusColor = (result: AnalysisResult) => {
  if (result.qcIssues.some(i => i.severity === QCSeverity.Error)) return 'bg-danger';
  if (result.qcIssues.some(i => i.severity === QCSeverity.Warning)) return 'bg-warning';
  return 'bg-success';
};

const ComparisonRow: React.FC<{ label: string; values: (string | number | undefined)[] }> = ({ label, values }) => {
  const allSame = values.every(v => v === values[0]);
  return (
    <tr className="border-b border-border-light dark:border-border-dark">
      <td className="py-2 px-2 md:px-4 font-medium text-sm text-gray-500 dark:text-gray-400 capitalize">{label.replace(/_/g, ' ')}</td>
      {values.map((value, index) => (
        <td key={index} className={`py-2 px-2 md:px-4 text-sm ${!allSame ? 'text-amber-500 font-semibold' : ''}`}>{String(value ?? 'N/A')}</td>
      ))}
    </tr>
  );
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-4 bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700/50 text-left font-semibold">
                <span>{title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-1 md:p-4">{children}</div>}
        </div>
    );
};

export const ComparisonView: React.FC<ComparisonViewProps> = ({ results }) => {
  const allKeys = (trackName: 'general' | 'video') => {
    const keySet = new Set<string>();
    results.forEach(r => {
      const track = r.mediaInfo[trackName];
      if(track) Object.keys(track).forEach(k => keySet.add(k));
    });
    return Array.from(keySet);
  };
  
  const generalKeys = allKeys('general');
  const videoKeys = allKeys('video');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File Comparison ({results.length} files)</h2>
      <div className="overflow-x-auto bg-card-light dark:bg-card-dark p-2 rounded-lg shadow-md mb-4">
        <table className="w-full border-collapse">
            <thead>
                <tr className="border-b-2 border-border-light dark:border-border-dark">
                    <th className="py-2 px-2 md:px-4 text-left font-semibold text-sm w-1/5">File Name</th>
                    {results.map(r => (
                    <th key={r.id} className="py-2 px-2 md:px-4 text-left font-semibold text-sm truncate">
                        <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(r)}`}></span>
                        <span className="truncate" title={r.fileName}>{r.fileName}</span>
                        </div>
                    </th>
                    ))}
                </tr>
            </thead>
        </table>
      </div>

        <CollapsibleSection title="EncodeSet Summary">
            <EncodeSetView results={results} />
        </CollapsibleSection>

        <CollapsibleSection title="General" defaultOpen={false}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {generalKeys.map(key => (
                        <ComparisonRow key={key} label={key} values={results.map(r => r.mediaInfo.general[key])} />
                        ))}
                    </tbody>
                </table>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Video" defaultOpen={false}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {videoKeys.map(key => (
                        <ComparisonRow key={key} label={key} values={results.map(r => r.mediaInfo.video?.[key])} />
                        ))}
                    </tbody>
                </table>
            </div>
        </CollapsibleSection>
    </div>
  );
};