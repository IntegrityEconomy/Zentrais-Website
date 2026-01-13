'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const topicCategories = [
  {
    category: 'Society & News',
    topics: ['World Politics', 'Social Justice', 'Climate Change', 'Education', 'Healthcare'],
  },
  {
    category: 'Tech & Future',
    topics: ['Artificial Intelligence', 'Space Exploration', 'Biotech', 'Cybersecurity', 'Web3'],
  },
  {
    category: 'Money & Biz',
    topics: ['Investing', 'Entrepreneurship', 'Cryptocurrency', 'Real Estate', 'Startups'],
  },
  {
    category: 'Art & Media',
    topics: ['Film Critique', 'Music', 'Literature', 'Photography', 'Design'],
  },
  {
    category: 'Life & Health',
    topics: ['Mental Health', 'Fitness', 'Nutrition', 'Relationships', 'Self-Improvement'],
  },
  {
    category: 'Sport & Games',
    topics: ['Football', 'Basketball', 'Esports', 'Chess', 'Gaming'],
  },
];

export default function TopicsPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load previously selected topics from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected_topics');
      if (saved) {
        try {
          const topics = JSON.parse(saved);
          setSelectedTopics(topics);
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
    setError('');
  };

  const handleContinue = async () => {
    if (selectedTopics.length < 3) {
      setError('You need to select at least 3 topics to proceed.');
      return;
    }

    // Save selected topics
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_topics', JSON.stringify(selectedTopics));
    }

    // Save user preferences to backend
    try {
      const response = await fetch('/api/user/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selectedTopics }),
      });

      if (response.ok) {
        router.push('/feed');
      } else {
        // Even if API fails, proceed to feed
        router.push('/feed');
      }
    } catch (error) {
      // Even if API fails, proceed to feed
      router.push('/feed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Welcome To Perspectives</h1>
        <p className="text-sm text-gray-600 mt-1">pick at least 3 topics</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {topicCategories.map((category) => (
          <div key={category.category} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h2>
            <div className="flex flex-wrap gap-2">
              {category.topics.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <Badge
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {error && (
          <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
        )}
        <Button
          onClick={handleContinue}
          disabled={selectedTopics.length < 3}
          className={`w-full rounded-full py-6 text-lg font-semibold ${
            selectedTopics.length >= 3
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

