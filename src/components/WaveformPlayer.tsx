import React, { useEffect, useRef, useState } from 'react';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRefs: React.MutableRefObject<{ [key: string]: HTMLAudioElement }>;
  podcastId: string;
  barColor?: string;
  progressColor?: string;
}

export default function WaveformPlayer({
  audioUrl,
  isPlaying,
  onPlayPause,
  audioRefs,
  podcastId,
  barColor = '#4f46e5',
  progressColor = '#818cf8',
}: WaveformPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let audio = audioRefs.current[podcastId];
    let mounted = true;

    const setupAudio = async () => {
      try {
        if (!audio) {
          audio = new Audio();
          audio.preload = 'metadata';
          audioRefs.current[podcastId] = audio;

          // Set up event listeners
          audio.addEventListener('loadedmetadata', () => {
            if (mounted) {
              setIsLoading(false);
              setError(null);
            }
          });

          audio.addEventListener('timeupdate', () => {
            if (mounted && audio.duration) {
              const percentage = (audio.currentTime / audio.duration) * 100;
              setProgress(isFinite(percentage) ? percentage : 0);
            }
          });

          audio.addEventListener('ended', () => {
            if (mounted) {
              onPlayPause();
              audio.currentTime = 0;
              setProgress(0);
            }
          });

          audio.addEventListener('error', () => {
            if (mounted) {
              setError('Error loading audio');
              setIsLoading(false);
            }
          });

          // Set source and load
          audio.src = audioUrl;
          await audio.load();

          // Set timeout for loading
          loadingTimeoutRef.current = setTimeout(() => {
            if (mounted && isLoading) {
              setError('Audio loading timed out');
              setIsLoading(false);
            }
          }, 10000); // 10 second timeout
        }
      } catch (err) {
        if (mounted) {
          setError('Error loading audio');
          setIsLoading(false);
        }
      }
    };

    setupAudio();

    return () => {
      mounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (audioRefs.current[podcastId]) {
        const currentAudio = audioRefs.current[podcastId];
        currentAudio.pause();
        currentAudio.src = '';
        delete audioRefs.current[podcastId];
      }
    };
  }, [audioUrl, audioRefs, podcastId, onPlayPause]);

  useEffect(() => {
    const audio = audioRefs.current[podcastId];
    if (!audio || isLoading) return;

    const handlePlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error('Error playing audio:', err);
        onPlayPause();
      }
    };

    if (isPlaying) {
      handlePlay();
    } else {
      audio.pause();
    }
  }, [isPlaying, audioRefs, podcastId, onPlayPause, isLoading]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[podcastId];
    if (!audio || !progressBarRef.current || isLoading) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * audio.duration;

    if (isFinite(time)) {
      audio.currentTime = time;
      setProgress(percentage);
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRefs.current[podcastId];
    if (!audio || isLoading) return;

    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    if (isFinite(newTime)) {
      audio.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    const audio = audioRefs.current[podcastId];
    if (!audio || isLoading) return;
    audio.currentTime = 0;
    setProgress(0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={handleRestart}
          className="p-1 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          title="Restart"
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSkip(-30)}
          className="p-1 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          title="Back 30 seconds"
          disabled={isLoading}
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSkip(30)}
          className="p-1 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          title="Forward 30 seconds"
          disabled={isLoading}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
      <div 
        className="w-full h-10 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-gray-500">Loading audio...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-red-500">{error}</span>
          </div>
        ) : (
          <div
            className="h-full transition-all duration-100"
            style={{ 
              width: `${progress}%`,
              backgroundColor: progressColor
            }}
          />
        )}
      </div>
    </div>
  );
}