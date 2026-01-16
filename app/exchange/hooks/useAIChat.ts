import { useState } from 'react';
import { AIChatMessage } from '../types';
import { getCurrentTimeStringWithAmPm } from '../utils';

export function useAIChat() {
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([]);
  const [aiInputText, setAiInputText] = useState('');

  const sendAIMessage = () => {
    if (!aiInputText.trim()) return;
    
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      text: aiInputText,
      isFromAI: false,
      timestamp: getCurrentTimeStringWithAmPm()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response based on message content
    setTimeout(() => {
      let aiResponse: AIChatMessage;
      
      if (aiMessages.length === 0) {
        // First message - ask about budget
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: "I can see you are in Calgary Alberta, do you want me to limit my search there and also can I know your budget?",
          isFromAI: true,
          timestamp: getCurrentTimeStringWithAmPm()
        };
      } else if (aiInputText.toLowerCase().includes('$500') || aiInputText.includes('500')) {
        // Budget provided - show search results
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: "I Found 5 Antique tables in Canada. Check them out",
          isFromAI: true,
          timestamp: getCurrentTimeStringWithAmPm(),
          imageResults: [
            {
              id: '1',
              title: 'Victorian Dining Table',
              price: 450,
              imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=300&q=80'
            },
            {
              id: '2', 
              title: 'Antique Oak Table',
              price: 380,
              imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=300&q=80'
            },
            {
              id: '3',
              title: 'Vintage Round Table',
              price: 520,
              imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'
            },
            {
              id: '4',
              title: 'Mahogany Side Table',
              price: 280,
              imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80'
            },
            {
              id: '5',
              title: 'Classic Wood Table',
              price: 495,
              imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=300&q=80'
            }
          ]
        };
      } else {
        // Default response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          text: "I'd be happy to help you find what you're looking for! Can you tell me more about your budget and specific preferences?",
          isFromAI: true,
          timestamp: getCurrentTimeStringWithAmPm()
        };
      }
      
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setAiInputText('');
  };

  return {
    aiMessages,
    aiInputText,
    setAiInputText,
    sendAIMessage
  };
}