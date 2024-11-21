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

interface FeaturedPodcastProps {
  podcast: Podcast;
  isSelected: boolean;
  onSelect: (podcast: Podcast) => void;
}

export default function FeaturedPodcast({
  podcast,
  isSelected,
  onSelect,
}: FeaturedPodcastProps) {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${
      isSelected ? 'ring-2 ring-indigo-500' : ''
    }`}>
      <div className="flex gap-6">
        <div className="relative">
          <img
            src={podcast.imageUrl}
            alt={podcast.title}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => onSelect(podcast)}
            className="absolute bottom-4 right-4 p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
          >
            {isSelected ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-indigo-600">
                {podcast.episode}
              </span>
              {isSelected && (
                <span className="text-sm font-medium text-emerald-600">
                  Now Playing
                </span>
              )}
            </div>
            <span className="text-base text-gray-500">{podcast.host}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {podcast.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {podcast.description}
          </p>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-5 h-5 mr-2" />
              {new Date(podcast.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              {podcast.duration}
            </div>
          </div>

          <div className="flex-1">
            <WaveformPlayer
              audioUrl={podcast.audioUrl}
              isPlaying={isSelected}
              onPlayPause={() => onSelect(podcast)}
              audioRefs={audioRefs}
              podcastId={podcast.id}
              barColor="#818cf8"
              progressColor="#4f46e5"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {podcast.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full"
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