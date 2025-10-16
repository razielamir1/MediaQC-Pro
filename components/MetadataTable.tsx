
import React from 'react';
import type { Track } from '../types';

interface MetadataTableProps {
  title: string;
  data: Track;
}

export const MetadataTable: React.FC<MetadataTableProps> = ({ title, data }) => {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-lg font-semibold text-primary mb-3 border-b border-border-light dark:border-border-dark pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="font-medium w-1/3 text-gray-500 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
            <span className="w-2/3 truncate" title={String(value)}>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
