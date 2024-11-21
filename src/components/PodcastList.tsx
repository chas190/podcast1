import React, { useRef } from 'react';
import { Calendar, Clock, Play, Pause } from 'lucide-react';
import WaveformPlayer from './WaveformPlayer';

interface Podcast {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  imageUrl: string;
  tags: string[];
  host: string;
  episode: string;
  audioUrl: string;
}

interface PodcastListProps {
  podcasts: Podcast[];
  onPodcastSelect: (podcast: Podcast) => void;
  selectedPodcastId?: string;
}

export default function PodcastList({
  podcasts,
  onPodcastSelect,
  selectedPodcastId,
}: PodcastListProps) {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handlePodcastSelect = (podcast: Podcast) => {
    // Stop all other audio players
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== podcast.id) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    onPodcastSelect(podcast);
  };

  return (
    <div className="space-y-6">
      {podcasts.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          isSelected={selectedPodcastId === podcast.id}
          onSelect={handlePodcastSelect}
          audioRefs={audioRefs}
        />
      ))}
    </div>
  );
}

function PodcastCard({
  podcast,
  isSelected,
  onSelect,
  audioRefs,
}: {
  podcast: Podcast;
  isSelected: boolean;
  onSelect: (podcast: Podcast) => void;
  audioRefs: React.MutableRefObject<{ [key: string]: HTMLAudioElement }>;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="relative">
          <img
            src={podcast.imageUrl}
            alt={podcast.title}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <button
            onClick={() => onSelect(podcast)}
            className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
          >
            {isSelected ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-indigo-600">
                {podcast.episode}
              </span>
              {isSelected && (
                <span className="text-sm font-medium text-emerald-600">
                  Now Playing
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{podcast.host}</span>
          </div>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 truncate">
            {podcast.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {podcast.description}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(podcast.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {podcast.duration}
            </div>
          </div>
          <div className="mt-4">
            <WaveformPlayer
              audioUrl={podcast.audioUrl}
              isPlaying={isSelected}
              onPlayPause={() => onSelect(podcast)}
              audioRefs={audioRefs}
              podcastId={podcast.id}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {podcast.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}