
export type Theme = 'light' | 'dark';

export interface Track {
  [key: string]: string | number | undefined;
}

export interface MediaInfo {
  general: Track;
  video: Track | null;
  audio: Track[];
  subtitles: Track[];
}

export enum QCSeverity {
  Pass = 'Pass',
  Warning = 'Warning',
  Error = 'Error',
}

export interface QCIssue {
  id: string;
  description: string;
  details: string;
  severity: QCSeverity;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  timestamp: string;
  mediaInfo: MediaInfo;
  qcIssues: QCIssue[];
  qcSummary: string;
}

export enum ExportFormat {
    JSON = 'json',
    XML = 'xml',
    CSV = 'csv',
    Text = 'txt'
}
