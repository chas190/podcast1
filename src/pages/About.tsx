import React from 'react';
import Header from '../components/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About PodcastHub</h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Welcome to PodcastHub, your premier destination for thought-provoking conversations
              and engaging content across technology, design, and personal development.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We strive to bring you the highest quality podcasts that inform, inspire, and
              entertain. Our carefully curated content features industry experts, thought
              leaders, and innovative voices across various fields.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>High-quality audio streaming</li>
              <li>Intuitive playback controls</li>
              <li>Smart search functionality</li>
              <li>Topic-based filtering</li>
              <li>Responsive design for all devices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions or suggestions? We'd love to hear from you. Reach out to us at
              <a href="mailto:contact@podcasthub.com" className="text-indigo-600 hover:text-indigo-800 ml-1">
                contact@podcasthub.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}