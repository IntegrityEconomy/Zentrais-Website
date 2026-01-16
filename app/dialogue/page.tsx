'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Search, Edit, ArrowLeft, Send, Sparkles, X, Image, Mic, Square, Trash2 } from 'lucide-react';
import { BottomNav } from '@/components/app/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStoredToken, getStoredUserId } from '@/lib/auth';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  type?: 'TEXT' | 'IMAGE' | 'AUDIO';
  mediaUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'active' | 'away';
  hasPencil?: boolean; // Green pencil icon indicator
}

export default function DialoguePage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Socket.IO connection
  const socketRef = useRef<Socket | null>(null);
  const currentUserId = getStoredUserId();
  const usernameCacheRef = useRef<Map<string, string>>(new Map());

  const resolveUsername = useCallback(async (userId: string) => {
    if (!userId) return;
    if (userId === currentUserId) return;
    if (usernameCacheRef.current.has(userId)) return;

    try {
      const response = await fetch(`${DIALOGUE_BACKEND_URL}/messages/user/verify/${userId}`);
      if (!response.ok) return;
      const data = await response.json();
      const username = (data?.username as string | undefined) || userId;

      usernameCacheRef.current.set(userId, username);

      // Update any existing conversations/messages that were temporarily showing the raw userId
      setConversations((prev) => prev.map((c) => (c.id === userId ? { ...c, name: username } : c)));
      setMessages((prev) =>
        prev.map((m) => (m.sender === 'other' && m.senderName === userId ? { ...m, senderName: username } : m))
      );
    } catch (error) {
      console.error('Error resolving username:', error);
    }
  }, [currentUserId]);

  // Helper to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = getStoredToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }, []);

  // Image upload handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendImage = async () => {
    if (!selectedImage || !selectedConversation) return;
    
    setUploading(true);
    try {
      const token = getStoredToken();
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('receiverId', selectedConversation);
      formData.append('type', 'IMAGE');

      const response = await fetch(`${DIALOGUE_BACKEND_URL}/upload/media`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      const mediaKey = data.mediaKey || data.key;

      // Send message via WebSocket
      socketRef.current?.emit('send_message', {
        receiverId: selectedConversation,
        mediaUrl: mediaKey,
        type: 'IMAGE',
      });

      clearImageSelection();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  // Voice recording handlers
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg'
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return null;
  };

  const getFileExtension = (mimeType: string) => {
    const extensions: Record<string, string> = {
      'audio/webm': 'webm',
      'audio/webm;codecs=opus': 'webm',
      'audio/ogg': 'ogg',
      'audio/ogg;codecs=opus': 'ogg',
      'audio/mp4': 'm4a',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav'
    };
    return extensions[mimeType] || 'webm';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};
      
      const mediaRecorder = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Could not start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setAudioPreviewUrl(null);
    setRecordingTime(0);
  };

  const handleSendVoice = async () => {
    if (!recordedBlob || !selectedConversation) return;
    
    setUploading(true);
    try {
      const token = getStoredToken();
      const extension = getFileExtension(recordedBlob.type);
      const fileName = `voice-recording-${Date.now()}.${extension}`;
      const file = new File([recordedBlob], fileName, { type: recordedBlob.type });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('receiverId', selectedConversation);
      formData.append('type', 'AUDIO');

      const response = await fetch(`${DIALOGUE_BACKEND_URL}/upload/media`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      const mediaKey = data.mediaKey || data.key;

      // Send message via WebSocket
      socketRef.current?.emit('send_message', {
        receiverId: selectedConversation,
        mediaUrl: mediaKey,
        type: 'AUDIO',
      });

      discardRecording();
    } catch (error) {
      console.error('Error uploading voice recording:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Connect to WebSocket server
    const socket = io(DIALOGUE_BACKEND_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      const otherUserId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
      const otherUserName = usernameCacheRef.current.get(otherUserId) || otherUserId;

      const newMessage: Message = {
        id: message.id,
        text: message.content || '',
        sender: message.sender_id === currentUserId ? 'user' : 'other',
        senderName: message.sender_id === currentUserId ? 'You' : otherUserName,
        timestamp: message.created_at || new Date().toISOString(),
        type: message.type || 'TEXT',
        mediaUrl: message.media_url,
      };
      
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      // Update conversation list with last message
      setConversations((prev) => {
        const existing = prev.find(c => c.id === otherUserId);
        const lastMessageText = message.type === 'IMAGE' ? '📷 Image' : message.type === 'AUDIO' ? '🎤 Voice message' : (message.content || '');
        if (existing) {
          return prev.map(c => 
            c.id === otherUserId 
              ? { ...c, lastMessage: lastMessageText, timestamp: message.created_at }
              : c
          );
        } else {
          // New conversation from incoming message
          return [{
            id: otherUserId,
            name: otherUserName,
            lastMessage: lastMessageText,
            timestamp: message.created_at || new Date().toISOString(),
            unread: 1,
            status: 'away' as const,
          }, ...prev];
        }
      });

      // If we don't yet know the username, resolve it in the background and patch UI
      void resolveUsername(otherUserId);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socketRef.current = socket;

    // Load conversations
    loadConversations();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/dialogue/conversations', {
        headers: getAuthHeaders(),
      });
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, router]);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/dialogue/conversations/${conversationId}/messages`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation, loadMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    if (!socketRef.current?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    // Send message via WebSocket
    socketRef.current.emit('send_message', {
      receiverId: selectedConversation,
      content: messageText,
      type: 'TEXT',
      mediaUrl: '',
    });

    setMessageText('');
  };

  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleStartNewConversation = async () => {
    if (!newUserId.trim()) return;

    const recipientId = newUserId.trim();
    setVerifyError(null);
    
    // Check if we already have a conversation with this user
    const existingConversation = conversations.find(c => c.id === recipientId);
    if (existingConversation) {
      setSelectedConversation(existingConversation.id);
      setNewUserId('');
      setShowNewConversation(false);
      return;
    }

    // Verify the user exists in the database
    setVerifying(true);
    try {
      const response = await fetch(`/api/user/${recipientId}`);
      const data = await response.json();
      
      if (!response.ok || !data.exists) {
        setVerifyError('User not found. Please check the User ID.');
        setVerifying(false);
        return;
      }

      // Create a new conversation with the verified user
      const newConversation: Conversation = {
        id: recipientId,
        name: data.username || recipientId,
        lastMessage: '',
        timestamp: new Date().toISOString(),
        unread: 0,
        status: 'away',
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(recipientId);
      setNewUserId('');
      setShowNewConversation(false);
    } catch (error) {
      console.error('Error verifying user:', error);
      setVerifyError('Could not verify user. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    }
  };

  // Conversation Detail View
  if (selectedConversation) {
    const conversation = conversations.find((c) => c.id === selectedConversation);
    return (
      <>
        <div className="min-h-screen bg-[#EFF3EC] flex flex-col pb-24">
          {/* Status Bar (mock) */}
          <div className="bg-[#EFF3EC] border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-gray-600 rounded-sm"></div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-[#EFF3EC] border-b border-gray-200 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-1 text-[#3C6610] hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-gray-900 text-sm">{conversation?.name}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {conversation?.status === 'active' ? 'Active Now' : 'Active Now'}
                </p>
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={conversation?.avatar} />
              <AvatarFallback>{conversation?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#EFF3EC]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {message.sender === 'other' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={conversation?.avatar} />
                    <AvatarFallback>{conversation?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-[#3C6610] text-white'
                  }`}
                >
                  {/* Render based on message type */}
                  {message.type === 'IMAGE' && message.mediaUrl ? (
                    <img 
                      src={message.mediaUrl} 
                      alt="Shared image" 
                      className="max-w-full rounded-lg max-h-64 object-contain"
                      loading="lazy"
                    />
                  ) : message.type === 'AUDIO' && message.mediaUrl ? (
                    <div className="min-w-[200px]">
                      <audio 
                        src={message.mediaUrl} 
                        controls 
                        className="w-full h-10"
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <p className={`text-xs mt-1.5 ${
                    message.sender === 'user' ? 'text-gray-500' : 'text-white/70'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-[#EFF3EC] border-t border-gray-200 px-4 py-3">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
                <button
                  onClick={clearImageSelection}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Voice Recording Preview */}
            {recordedBlob && audioPreviewUrl && (
              <div className="mb-3 flex items-center gap-3 bg-white rounded-lg p-3">
                <audio src={audioPreviewUrl} controls className="h-8 flex-1" />
                <button
                  onClick={discardRecording}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendVoice}
                  disabled={uploading}
                  className="p-2 bg-[#3C6610] text-white rounded-full hover:bg-[#2d4c0c] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="mb-3 flex items-center gap-2 text-red-500">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Recording: {formatRecordingTime(recordingTime)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type Something"
                className="flex-1 bg-white border-gray-300 rounded-full px-4 py-2.5 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (selectedImage) {
                      handleSendImage();
                    } else {
                      handleSendMessage();
                    }
                  }
                }}
                disabled={isRecording}
              />

              {/* Image upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || uploading}
                className="p-2.5 rounded-full text-[#3C6610] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send image"
              >
                <Image className="w-5 h-5" />
              </button>

              {/* Voice recording button */}
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="p-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
                  title="Stop recording"
                >
                  <Square className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  disabled={uploading || !!recordedBlob}
                  className="p-2.5 rounded-full text-[#3C6610] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Record voice message"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}

              {/* Send button */}
              <button
                onClick={selectedImage ? handleSendImage : handleSendMessage}
                disabled={(!messageText.trim() && !selectedImage) || isRecording || uploading}
                className="p-2.5 rounded-full bg-[#3C6610] text-white hover:bg-[#2d4c0c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  // Dialog List View
  return (
    <>
      <div className="min-h-screen bg-[#EFF3EC] flex flex-col pb-24">
        {/* Status Bar (mock) */}
        <div className="bg-[#EFF3EC] border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
            <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            </div>
            <div className="w-6 h-3 border border-gray-600 rounded-sm"></div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#EFF3EC] border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/user-image-1.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/dialogue_zentrais_logo.png" 
                alt="Zentrais" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dialogue/search')}
                className="p-2 text-[#3C6610] hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search conversations"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/dialogue/ai')}
                className="p-2 text-[#3C6610] hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open AI dialogue"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-[#EFF3EC]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition-colors"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {conversation.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {conversation.name}
                    </p>
                    <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(conversation.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#3C6610] flex items-center justify-center shadow-sm">
                    <Edit className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Floating New Conversation Button */}
        <button
          onClick={() => setShowNewConversation(true)}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-[#3C6610] text-white shadow-lg hover:bg-[#2d4c0c] transition-colors flex items-center justify-center z-40"
          aria-label="Start new conversation"
        >
          <Edit className="w-6 h-6" />
        </button>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">New Conversation</h2>
                <button
                  onClick={() => {
                    setShowNewConversation(false);
                    setNewUserId('');
                    setVerifyError(null);
                  }}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Enter the user ID to start a conversation
              </p>
              <Input
                value={newUserId}
                onChange={(e) => {
                  setNewUserId(e.target.value);
                  setVerifyError(null);
                }}
                placeholder="Enter user ID (e.g., cm5abc123...)"
                className={`mb-2 ${verifyError ? 'border-red-500' : ''}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !verifying) {
                    handleStartNewConversation();
                  }
                }}
                autoFocus
                disabled={verifying}
              />
              {verifyError && (
                <p className="text-sm text-red-500 mb-4">{verifyError}</p>
              )}
              {!verifyError && <div className="mb-2" />}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowNewConversation(false);
                    setNewUserId('');
                    setVerifyError(null);
                  }}
                  disabled={verifying}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleStartNewConversation}
                  disabled={!newUserId.trim() || verifying}
                >
                  {verifying ? 'Verifying...' : 'Start Chat'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
