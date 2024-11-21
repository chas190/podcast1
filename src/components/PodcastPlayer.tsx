import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import WaveformPlayer from './WaveformPlayer';

interface PodcastPlayerProps {
  title: string;
  duration: string;
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onForward: () => void;
  onBackward: () => void;
}

export default function PodcastPlayer({
  title,
  duration,
  audioUrl,
  isPlaying,
  onPlayPause,
  onForward,
  onBackward,
}: PodcastPlayerProps) {
  const [currentTime, setCurrentTime] = useState('00:00');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500">{`${currentTime} / ${duration}`}</p>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackward}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={onPlayPause}
              className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={onForward}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <WaveformPlayer
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onTimeUpdate={setCurrentTime}
          />
        </div>
      </div>
    </div>
  );
}