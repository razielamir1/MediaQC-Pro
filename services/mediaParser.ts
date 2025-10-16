import type { MediaInfo, Track } from '../types';

// This is a mock media parser. In a real application, this would use a library
// like mediainfo.js (WASM) to parse the actual file bytes.
// For this simulation, we return different mock data based on the filename.

const perfectVideo: MediaInfo = {
  general: {
    file_name: 'perfect_movie.mov',
    file_size: '1.2 GB',
    format: 'MPEG-4',
    duration: '120.5s',
    overall_bit_rate: 8858688,
    creation_date: new Date().toISOString(),
  },
  video: {
    codec: 'AVC',
    resolution: '1920x1080',
    frame_rate: 29.97,
    frame_rate_mode: 'CFR',
    aspect_ratio: '16:9',
    color_space: 'YUV',
    bit_depth: '8 bits',
    scan_type: 'Progressive',
    gop_structure: 'IBBP',
    bit_rate: 8666688,
    profile: 'Main',
    level: '5.1',
    preset: 'Slow',
    gop_size: 50,
    duration: '120.5s',
  },
  audio: [
    {
      codec: 'AAC',
      channels: '2',
      sample_rate: 44100,
      bit_rate: 192000,
      bit_depth: '16 bits',
      language: 'en',
      duration: '120.5s',
      profile: 'LC',
    },
  ],
  subtitles: [
      { format: 'Timed Text', language: 'en', count: '1' }
  ],
};

const vfrVideo: MediaInfo = {
    ...perfectVideo,
    general: { ...perfectVideo.general, file_name: 'vfr_video.mp4' },
    video: { ...perfectVideo.video!, frame_rate: 29.97, frame_rate_mode: 'VFR' }
};

const mismatchedDurationVideo: MediaInfo = {
    ...perfectVideo,
    general: { ...perfectVideo.general, file_name: 'mismatch_duration.mkv', duration: '125.0s' },
    video: { ...perfectVideo.video!, duration: '125.0s'},
    audio: [{ ...perfectVideo.audio[0], duration: '120.5s' }],
};

const missingAudioVideo: MediaInfo = {
    ...perfectVideo,
    general: { ...perfectVideo.general, file_name: 'no_audio.mp4' },
    audio: [],
};

const audioOnly: MediaInfo = {
    general: {
        file_name: 'podcast_episode.mp3',
        file_size: '50.2 MB',
        format: 'MPEG Audio',
        duration: '300.0s',
        overall_bit_rate: 128000,
        creation_date: new Date().toISOString(),
    },
    video: null,
    audio: [{
        codec: 'MP3',
        channels: '2',
        sample_rate: 44100,
        bit_rate: 128000,
        bit_depth: '16 bits',
        duration: '300.0s',
    }],
    subtitles: [],
};

const mockDatabase: { [key: string]: MediaInfo } = {
  'vfr': vfrVideo,
  'mismatch': mismatchedDurationVideo,
  'no_audio': missingAudioVideo,
  'mp3': audioOnly,
  'wav': audioOnly,
  'aac': audioOnly,
  'flac': audioOnly,
  'default': perfectVideo,
};

export const parseFile = (file: File): Promise<MediaInfo> => {
  return new Promise((resolve) => {
    // Simulate parsing delay
    setTimeout(() => {
        let key = 'default';
        if (file.name.includes('vfr')) key = 'vfr';
        else if (file.name.includes('mismatch')) key = 'mismatch';
        else if (file.name.includes('no_audio')) key = 'no_audio';
        else if (file.name.endsWith('.mp3')) key = 'mp3';
        
        const data = { ...mockDatabase[key] };
        data.general.file_name = file.name;
        data.general.file_size = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        resolve(JSON.parse(JSON.stringify(data))); // Deep copy to avoid mutation issues
    }, 1500);
  });
};