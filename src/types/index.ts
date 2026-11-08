export interface User {
  id: string;
  username: string; // e.g. @ananya
  displayName: string;
  avatarUrl: string;
  about: string;
  status: 'online' | 'offline' | 'typing';
  publicKeyPem: string;
  createdAt: number;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  message?: string;
  createdAt: number;
}

export type MessageType = 
  | 'text'
  | 'image'
  | 'sticker'
  | 'audio'
  | 'location'
  | 'document'
  | 'system_e2ee'
  | 'call_summary';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  type: MessageType;
  content: string; // Plaintext or decrypted content for local viewing
  encryptedCiphertext?: string;
  iv?: string;
  mediaUrl?: string;
  mediaCaption?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // in seconds
  locationCoords?: { lat: number; lng: number; title: string };
  reactions: Record<string, string[]>; // emoji -> array of userIds
  status: 'sent' | 'delivered' | 'read';
  timestamp: number;
  replyToMessageId?: string;
  isStarred?: boolean;
  deletedFor?: string[]; // userIds who deleted it
}

export interface Chat {
  id: string;
  participantIds: string[];
  type: 'direct' | 'group';
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: Message;
  unreadCounts: Record<string, number>; // userId -> unread count
  isPinned?: boolean;
  isMuted?: boolean;
  updatedAt: number;
}

export interface Sticker {
  id: string;
  url: string;
  packName: string;
  emoji: string;
  title: string;
  isAiGenerated?: boolean;
}

export interface CallLog {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'completed' | 'missed' | 'declined';
  durationSeconds: number;
  timestamp: number;
  isEncrypted: boolean;
}

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-request' | 'call-accept' | 'call-reject' | 'call-end';
  callId: string;
  senderId: string;
  receiverId: string;
  callType: 'voice' | 'video';
  sdp?: any;
  candidate?: any;
}
