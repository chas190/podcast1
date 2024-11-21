import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import podcastData from './data/podcasts.json';
import SearchBar from './components/SearchBar';
import PodcastList from './components/PodcastList';
import FeaturedPodcast from './components/FeaturedPodcast';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import About from './pages/About';
import SignIn from './pages/SignIn';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<typeof podcastData.podcasts[0] | null>(null);
  const [featuredPodcast, setFeaturedPodcast] = useState(podcastData.podcasts[0]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const podcastId = params.get('podcast');
      if (podcastId) {
        const podcast = podcastData.podcasts.find(p => p.id === podcastId);
        if (podcast) {
          setFeaturedPodcast(podcast);
        }
      }
    } catch (error) {
      console.error('Error processing URL parameters:', error);
    }
  }, []);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    podcastData.podcasts.forEach((podcast) => {
      podcast.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  const filteredPodcasts = useMemo(() => {
    return podcastData.podcasts
      .filter(podcast => podcast.id !== featuredPodcast?.id)
      .filter((podcast) => {
        const matchesSearch = podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          podcast.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.every((tag) => podcast.tags.includes(tag));
        
        return matchesSearch && matchesTags;
      });
  }, [searchQuery, selectedTags, featuredPodcast?.id]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePodcastSelect = (podcast: typeof podcastData.podcasts[0]) => {
    setSelectedPodcast((prev) => 
      prev?.id === podcast.id ? null : podcast
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <ErrorBoundary>
            {featuredPodcast && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Featured Episode</h2>
                <FeaturedPodcast
                  podcast={featuredPodcast}
                  isSelected={selectedPodcast?.id === featuredPodcast.id}
                  onSelect={handlePodcastSelect}
                />
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Other Episodes</h2>
              <SearchBar
                onSearch={setSearchQuery}
                onTagSelect={handleTagSelect}
                selectedTags={selectedTags}
                availableTags={availableTags}
              />

              <PodcastList
                podcasts={filteredPodcasts}
                onPodcastSelect={handlePodcastSelect}
                selectedPodcastId={selectedPodcast?.id}
              />
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}