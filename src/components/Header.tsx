import React, { useState } from 'react';
import { Radio, Menu, X } from 'lucide-react';
import podcastData from '../data/podcasts.json';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">PodcastHub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {podcastData.navigation.map((item) => (
              <React.Fragment key={item.name}>
                {item.isButton ? (
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => window.location.href = item.url}
                  >
                    {item.name}
                  </button>
                ) : (
                  <a
                    href={item.url}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {podcastData.navigation.map((item) => (
              <div key={item.name} className="block">
                {item.isButton ? (
                  <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => {
                      window.location.href = item.url;
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                ) : (
                  <a
                    href={item.url}
                    className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}