
import type { AnalysisResult, ExportFormat, MediaInfo, Track } from '../types';

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const toXML = (obj: any, rootName: string): string => {
    let xml = '';
    const toXmlRecursive = <T,>(value: T, name: string, ind: string) => {
        let xml = '';
        if (value instanceof Array) {
            for (let i = 0, n = value.length; i < n; i++) {
                xml += ind + toXmlRecursive(value[i], name, ind + '\t') + '\n';
            }
        } else if (typeof value == 'object' && value !== null) {
            let hasChild = false;
            xml += ind + '<' + name;
            for (let m in value) {
                if (m.charAt(0) === '@') {
                    xml += ' ' + m.substr(1) + '="' + value[m].toString() + '"';
                } else {
                    hasChild = true;
                }
            }
            xml += hasChild ? '>' : '/>';
            if (hasChild) {
                for (let m in value) {
                    if (m === '#text') {
                        xml += value[m];
                    } else if (m === '#cdata') {
                        xml += '<![CDATA[' + value[m] + ']]>';
                    } else if (m.charAt(0) !== '@') {
                        xml += toXmlRecursive(value[m], m, ind + '\t');
                    }
                }
                xml += (xml.charAt(xml.length - 1) === '\n' ? ind : '') + '</' + name + '>';
            }
        } else {
            xml += ind + '<' + name + '>' + value.toString() + '</' + name + '>';
        }
        return xml;
    };
    return `<?xml version="1.0" encoding="UTF-8" ?>\n${toXmlRecursive(obj, rootName, '')}`;
};

const toCSV = (mediaInfo: MediaInfo): string => {
    let csv = 'Track Type,Parameter,Value\n';
    const addTrackToCsv = (trackType: string, track: Track | null) => {
        if (!track) return;
        for (const [key, value] of Object.entries(track)) {
            const formattedValue = `"${String(value).replace(/"/g, '""')}"`;
            csv += `${trackType},${key},${formattedValue}\n`;
        }
    };
    addTrackToCsv('General', mediaInfo.general);
    addTrackToCsv('Video', mediaInfo.video);
    mediaInfo.audio.forEach((track, i) => addTrackToCsv(`Audio ${i+1}`, track));
    mediaInfo.subtitles.forEach((track, i) => addTrackToCsv(`Subtitle ${i+1}`, track));
    return csv;
};

const toTextSummary = (result: AnalysisResult): string => {
    let text = `MediaQC Pro Summary for: ${result.fileName}\n`;
    text += `Analysis Date: ${new Date(result.timestamp).toLocaleString()}\n\n`;

    text += "--- QC SUMMARY ---\n";
    text += `${result.qcSummary}\n`;
    if (result.qcIssues.length > 0) {
        result.qcIssues.forEach(issue => {
            text += `[${issue.severity}] ${issue.description}: ${issue.details}\n`;
        });
    } else {
        text += "No issues found.\n";
    }
    text += "\n";
    
    const addTrackToText = (title: string, track: Track | null) => {
        if (!track) return;
        text += `--- ${title.toUpperCase()} ---\n`;
        for (const [key, value] of Object.entries(track)) {
            text += `${key.replace(/_/g, ' ')}: ${value}\n`;
        }
        text += "\n";
    };

    addTrackToText('General', result.mediaInfo.general);
    addTrackToText('Video', result.mediaInfo.video);
    result.mediaInfo.audio.forEach((track, i) => addTrackToText(`Audio Stream ${i+1}`, track));
    result.mediaInfo.subtitles.forEach((track, i) => addTrackToText(`Subtitle Stream ${i+1}`, track));

    return text;
};

export const handleExport = (result: AnalysisResult, format: ExportFormat) => {
  const baseFileName = result.fileName.split('.').slice(0, -1).join('.');
  const fileName = `${baseFileName}_report.${format}`;
  
  switch (format) {
    case 'json':
      downloadFile(JSON.stringify(result, null, 2), fileName, 'application/json');
      break;
    case 'xml':
      downloadFile(toXML({ analysis: result }, 'MediaQCPro'), fileName, 'application/xml');
      break;
    case 'csv':
      downloadFile(toCSV(result.mediaInfo), fileName, 'text/csv');
      break;
    case 'txt':
      downloadFile(toTextSummary(result), fileName, 'text/plain');
      break;
  }
};
