
import React from 'react';
import type { QCIssue } from '../types';
import { QCSeverity } from '../types';
import { CheckCircleIcon, WarningIcon, ErrorIcon } from './icons/Icons';

interface QCSummaryPanelProps {
  issues: QCIssue[];
  summary: string;
}

const getSeverityStyles = (severity: QCSeverity) => {
  switch (severity) {
    case QCSeverity.Pass:
      return {
        icon: <CheckCircleIcon className="w-5 h-5 text-success" />,
        bgColor: 'bg-green-50 dark:bg-green-900/50',
        borderColor: 'border-green-200 dark:border-green-700',
      };
    case QCSeverity.Warning:
      return {
        icon: <WarningIcon className="w-5 h-5 text-warning" />,
        bgColor: 'bg-amber-50 dark:bg-amber-900/50',
        borderColor: 'border-amber-200 dark:border-amber-700',
      };
    case QCSeverity.Error:
      return {
        icon: <ErrorIcon className="w-5 h-5 text-danger" />,
        bgColor: 'bg-red-50 dark:bg-red-900/50',
        borderColor: 'border-red-200 dark:border-red-700',
      };
  }
};

export const QCSummaryPanel: React.FC<QCSummaryPanelProps> = ({ issues, summary }) => {
  const overallStatus = issues.some(i => i.severity === QCSeverity.Error) ? QCSeverity.Error
                      : issues.some(i => i.severity === QCSeverity.Warning) ? QCSeverity.Warning
                      : QCSeverity.Pass;

  const { icon, bgColor } = getSeverityStyles(overallStatus);

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-3 border-b border-border-light dark:border-border-dark pb-2">QC Summary</h3>

      <div className={`flex items-center p-4 rounded-lg mb-6 ${bgColor}`}>
        {icon}
        <div className="ml-3">
          <h4 className="font-semibold text-lg">Overall Status: {overallStatus}</h4>
          <p className="text-sm">{summary || 'AI-generated summary loading...'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {issues.length > 0 ? (
          issues.map(issue => {
            const styles = getSeverityStyles(issue.severity);
            return (
              <div key={issue.id} className={`p-4 border-l-4 rounded-r-lg ${styles.bgColor} ${styles.borderColor}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
                  <div className="ml-3">
                    <p className="font-semibold">{issue.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{issue.details}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 border-l-4 rounded-r-lg bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5"><CheckCircleIcon className="w-5 h-5 text-success" /></div>
                <div className="ml-3">
                    <p className="font-semibold">No Issues Detected</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">The file meets all quality control checks.</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
