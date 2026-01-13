import { NextRequest, NextResponse } from 'next/server';
import { topicsAPI } from '@/lib/api/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const timeFilter = searchParams.get('time') || '';
    const sortBy = searchParams.get('sort') || 'recent';

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Get all topics
    const allTopics = await topicsAPI.getAll();

    // Filter by search query
    let results = allTopics.filter((topic) => {
      const searchLower = query.toLowerCase();
      return (
        topic.title.toLowerCase().includes(searchLower) ||
        topic.description.toLowerCase().includes(searchLower) ||
        topic.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });

    // Apply time filter
    if (timeFilter) {
      const now = new Date();
      let cutoffDate: Date;

      if (timeFilter === 'Last 24hr') {
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (timeFilter === 'Last 7 days') {
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeFilter === 'Last 30Days') {
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else {
        cutoffDate = new Date(0);
      }

      results = results.filter((topic) => {
        const topicDate = new Date(topic.createdAt);
        return topicDate >= cutoffDate;
      });
    }

    // Sort results
    if (sortBy === 'recent') {
      results.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      results.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }

    return NextResponse.json({
      results: results.map((topic) => ({
        id: topic.id,
        title: topic.title,
        content: topic.description,
        author: topic.author,
        createdAt: topic.createdAt,
        tags: topic.tags,
      })),
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

