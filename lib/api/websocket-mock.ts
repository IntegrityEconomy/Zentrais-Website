// Mock WebSocket client for real-time updates
// This simulates WebSocket behavior using EventEmitter pattern

type EventCallback = (data: any) => void;

class MockWebSocketClient {
  private listeners: Map<string, EventCallback[]> = new Map();
  private connected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect() {
    this.connected = true;
    this.emit('connected', {});
    
    // Simulate periodic updates
    this.startSimulation();
  }

  disconnect() {
    this.connected = false;
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.emit('disconnected', {});
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  // Simulate receiving new posts
  simulateNewPost(threadId: string, post: any) {
    if (this.connected) {
      this.emit('new-post', { threadId, post });
    }
  }

  // Simulate vote updates
  simulateVoteUpdate(threadId: string, voteData: any) {
    if (this.connected) {
      this.emit('vote-update', { threadId, voteData });
    }
  }

  // Simulate topic updates
  simulateTopicUpdate(topic: any) {
    if (this.connected) {
      this.emit('topic-update', { topic });
    }
  }

  private startSimulation() {
    // Simulate random updates every 5-10 seconds
    this.reconnectTimer = setInterval(() => {
      if (this.connected && Math.random() > 0.7) {
        // Randomly emit updates
        const events = ['new-post', 'vote-update', 'topic-update'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.emit(randomEvent, { 
          timestamp: new Date().toISOString(),
          data: 'simulated update'
        });
      }
    }, 5000);
  }

  subscribe(threadId: string) {
    this.emit('subscribe', { threadId });
  }

  unsubscribe(threadId: string) {
    this.emit('unsubscribe', { threadId });
  }
}

// Singleton instance
let wsClient: MockWebSocketClient | null = null;

export function getWebSocketClient(): MockWebSocketClient {
  if (!wsClient) {
    wsClient = new MockWebSocketClient();
  }
  return wsClient;
}

export function useWebSocket(threadId?: string) {
  const client = getWebSocketClient();
  
  if (!client.connected) {
    client.connect();
  }

  if (threadId) {
    client.subscribe(threadId);
  }

  return client;
}

