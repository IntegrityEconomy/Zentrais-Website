import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    // Mock AI response - in production, this would call an actual AI service
    // For now, return a contextual response based on keywords
    let response = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('movie') || lowerMessage.includes('film')) {
      response = `Certainly. Below is a curated set of movie suggestions suitable for a movie date, organized by tone and shared viewing experience. These selections emphasize emotional engagement, conversation value, and overall date-night appeal.

Romantic & Intimate (Connection-Focused):
• Before Sunrise (1995) - A beautiful conversation-driven film about connection
• Blue Valentine (2010) - An honest look at relationships
• Her (2013) - Thought-provoking exploration of love and connection
• Call Me by Your Name (2017) - A beautiful coming-of-age romance`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what')) {
      response = 'I\'m here to help! I can assist with movie recommendations, answer questions, provide insights, and more. What would you like to know?';
    } else {
      response = `I understand your question about "${message}". Let me provide you with a thoughtful response based on that topic. This is a mock response - in production, this would be powered by a real AI service like OpenAI or Anthropic.`;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing AI chat:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

