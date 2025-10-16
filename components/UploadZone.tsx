import React, { useState, useCallback } from 'react';
// FIX: Removed FileVideoIcon from import as it is not exported from Icons.tsx and not used in this component.
import { UploadCloudIcon } from './icons/Icons';
import { SUPPORTED_FORMATS } from '../constants';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  error: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesSelected, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => SUPPORTED_FORMATS.includes(file.type) || file.name.endsWith('.mxf'));
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    }
  };

  const dragDropClasses = isDragging
    ? 'border-primary bg-sky-100 dark:bg-sky-900/50'
    : 'border-border-light dark:border-border-dark';

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto animate-fadeIn">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full p-8 md:p-16 border-2 border-dashed rounded-lg text-center transition-colors duration-300 ${dragDropClasses}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <UploadCloudIcon className="w-16 h-16 text-primary" />
          <h2 className="text-2xl font-semibold">Drag & drop files here</h2>
          <p className="text-secondary dark:text-slate-400">or</p>
          <label htmlFor="file-upload" className="cursor-pointer bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-600 dark:hover:bg-sky-400 transition-colors">
            Browse Files
          </label>
          <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept={SUPPORTED_FORMATS.join(',')} />
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
            Supported formats: MP4, MOV, MKV, AVI, MXF, TS, WAV, MP3, AAC, FLAC
          </p>
        </div>
      </div>
      {error && <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 border border-danger text-danger rounded-md w-full">{error}</div>}
    </div>
  );
};