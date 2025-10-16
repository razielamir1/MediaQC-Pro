import React from 'react';
import type { AnalysisResult } from '../types';

interface EncodeSetViewProps {
  results: AnalysisResult[];
}

// Helper to get nested properties safely, including array access like 'audio[0]'
const get = (obj: any, path: string, defaultValue: any = 'N/A') => {
    const value = path.split('.').reduce((acc, part) => {
        if (acc === undefined || acc === null) return undefined;
        
        const match = part.match(/(\w+)\[(\d+)\]/);
        if (match) {
            const arrayKey = match[1];
            const arrayIndex = parseInt(match[2], 10);
            const arr = acc[arrayKey];
            return Array.isArray(arr) ? arr[arrayIndex] : undefined;
        }
        return acc[part];
    }, obj);
    
    return value !== undefined && value !== null ? value : defaultValue;
};


export const EncodeSetView: React.FC<EncodeSetViewProps> = ({ results }) => {
    const columns = [
        { header: 'File_Name', accessor: (r: AnalysisResult) => r.fileName },
        { header: 'Video_Bitrate', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.bit_rate') },
        { header: 'Video_Resolution', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.resolution') },
        { header: 'Video_Profile', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.profile') },
        { header: 'Video_Level', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.level') },
        { header: 'Video_Preset', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.preset') },
        { header: 'Video_Framerate', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.frame_rate') },
        { header: 'Video_GOP', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'video.gop_size') },
        { header: 'Audio_SampleRate', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'audio[0].sample_rate') },
        { header: 'Audio_Bitrate', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'audio[0].bit_rate') },
        { header: 'Audio_AacProfile', accessor: (r: AnalysisResult) => get(r.mediaInfo, 'audio[0].profile') },
    ];
    
    // Don't show file name column in single file view as it's redundant
    const visibleColumns = results.length > 1 ? columns : columns.slice(1);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-700/50">
                        {visibleColumns.map(col => <th key={col.header} className="p-2 font-semibold">{col.header.replace(/_/g, ' ')}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {results.map(result => (
                        <tr key={result.id} className="border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                           {visibleColumns.map(col => (
                               <td key={col.header} className="p-2 truncate max-w-xs" title={String(col.accessor(result))}>
                                   {String(col.accessor(result))}
                               </td>
                           ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {results.some(r => !r.mediaInfo.video || r.mediaInfo.audio.length === 0) && (
                <p className="p-2 mt-2 text-xs text-gray-500 dark:text-gray-400">Note: Some files may be audio-only or missing streams, resulting in 'N/A' values.</p>
            )}
        </div>
    );
};
