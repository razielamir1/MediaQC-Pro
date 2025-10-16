
import type { MediaInfo, QCIssue } from '../types';
import { QCSeverity } from '../types';

export const analyzeQC = (mediaInfo: MediaInfo): QCIssue[] => {
  const issues: QCIssue[] = [];
  const { general, video, audio } = mediaInfo;

  // Rule 1: Check for Variable Frame Rate (VFR)
  if (video?.frame_rate_mode === 'VFR') {
    issues.push({
      id: 'vfr_detected',
      description: 'Variable Frame Rate (VFR) Detected',
      details: `The video track uses VFR, which can cause sync issues in some editing software. Frame rate: ${video.frame_rate}`,
      severity: QCSeverity.Warning,
    });
  }

  // Rule 2: Check for missing audio stream (if it's a video file)
  if (video && audio.length === 0) {
    issues.push({
      id: 'missing_audio',
      description: 'Missing Audio Stream',
      details: 'The file contains a video track but no audio tracks were found.',
      severity: QCSeverity.Error,
    });
  }
  
  // Rule 3: Check for missing video stream (if not an audio file)
  if (!video && !general.format?.toString().toLowerCase().includes('audio')) {
      issues.push({
          id: 'missing_video',
          description: 'Missing Video Stream',
          details: 'The file does not appear to be an audio-only format but contains no video track.',
          severity: QCSeverity.Error,
      });
  }

  // Rule 4: Check for audio/video duration mismatch
  if (video && audio.length > 0) {
    const videoDuration = parseFloat(video.duration?.toString() || '0');
    audio.forEach((track, index) => {
      const audioDuration = parseFloat(track.duration?.toString() || '0');
      const diff = Math.abs(videoDuration - audioDuration);
      if (diff > 0.5) { // More than 500ms difference
        issues.push({
          id: `duration_mismatch_${index}`,
          description: 'Audio/Video Duration Mismatch',
          details: `Video duration (${videoDuration}s) and Audio Stream #${index + 1} duration (${audioDuration}s) differ by ${diff.toFixed(2)}s.`,
          severity: QCSeverity.Warning,
        });
      }
    });
  }

  // Rule 5: Check for missing language tag in audio
  audio.forEach((track, index) => {
    if (!track.language) {
      issues.push({
        id: `missing_lang_${index}`,
        description: 'Missing Audio Language Tag',
        details: `Audio Stream #${index + 1} does not have a language tag specified.`,
        severity: QCSeverity.Warning,
      });
    }
  });

  return issues;
};
