export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Thread {
  id: string;
  listingId: string;
  participantIds: string[];
  lastMessage: Message;
  unreadCount: number;
  listingTitle?: string; // Denormalized for display
  listingImage?: string; // Denormalized for display
  otherParticipantName?: string; // Denormalized for display
  otherParticipantAvatar?: string; // Denormalized for display
}

export interface CreateMessageInput {
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

export interface CreateThreadInput {
  listingId: string;
  senderId: string; // The user initiating the thread
  receiverId: string; // The listing owner
  initialMessage: string;
}

