import { User, FriendRequest, Chat, Message, CallLog, Sticker } from '../types';
import { generateUserKeyPair } from './crypto';

// Initial pre-loaded stickers
export const INITIAL_STICKERS: Sticker[] = [
  { id: 'stk_1', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=heart_eyes', packName: 'WhatsApp Classics', emoji: '😍', title: 'Love Eyes' },
  { id: 'stk_2', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=laughing', packName: 'WhatsApp Classics', emoji: '😂', title: 'LOL' },
  { id: 'stk_3', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=cool', packName: 'WhatsApp Classics', emoji: 'sunglasses', title: 'Chill Vibes' },
  { id: 'stk_4', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=party', packName: 'WhatsApp Classics', emoji: '🥳', title: 'Party Time' },
  { id: 'stk_5', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=thumbsup', packName: 'WhatsApp Classics', emoji: '👍', title: 'Approved' },
  { id: 'stk_6', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=mindblown', packName: 'WhatsApp Classics', emoji: '🤯', title: 'Mind Blown' },
  { id: 'stk_7', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot_love', packName: 'Cyber Stickers', emoji: '🤖', title: 'Ssupp Bot' },
  { id: 'stk_8', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=coffee_cat', packName: 'Cyber Stickers', emoji: '☕', title: 'Coffee Time' },
];

const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: 'ssupp_current_user_id',
  USERS: 'ssupp_users_list',
  KEYPAIRS: 'ssupp_user_keypairs',
  REQUESTS: 'ssupp_friend_requests',
  CHATS: 'ssupp_chats_list',
  MESSAGES: 'ssupp_messages_list',
  CALLS: 'ssupp_calls_log',
  STICKERS: 'ssupp_stickers_list',
  COMPLETED_TOURS: 'ssupp_completed_tours',
};

// Pure clean initial state for production live readiness
const INITIAL_USERS: User[] = [];
const INITIAL_REQUESTS: FriendRequest[] = [];
const INITIAL_MESSAGES: Message[] = [];
const INITIAL_CHATS: Chat[] = [];
const INITIAL_CALLS: CallLog[] = [];

/**
 * Storage Helpers
 */

export function getStoredCurrentUser(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
}

export function setStoredCurrentUser(userId: string | null): void {
  if (userId) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, userId);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  }
}

export function logoutUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
}

export function getStoredUsers(): User[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (!data) return [];
  return JSON.parse(data);
}

export function setStoredUsers(users: User[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredRequests(): FriendRequest[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS);
  if (!data) return [];
  return JSON.parse(data);
}

export function setStoredRequests(requests: FriendRequest[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

export function getStoredChats(): Chat[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CHATS);
  if (!data) return [];
  return JSON.parse(data);
}

export function setStoredChats(chats: Chat[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CHATS, JSON.stringify(chats));
}

export function getStoredMessages(): Message[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.MESSAGES);
  if (!data) return [];
  return JSON.parse(data);
}

export function setStoredMessages(messages: Message[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

export function getStoredCalls(): CallLog[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CALLS);
  if (!data) return [];
  return JSON.parse(data);
}

export function setStoredCalls(calls: CallLog[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CALLS, JSON.stringify(calls));
}

export function getStoredStickers(): Sticker[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.STICKERS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.STICKERS, JSON.stringify(INITIAL_STICKERS));
    return INITIAL_STICKERS;
  }
  return JSON.parse(data);
}

export function setStoredStickers(stickers: Sticker[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.STICKERS, JSON.stringify(stickers));
}

// Onboarding tour status
export function hasCompletedTour(userId: string): boolean {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLETED_TOURS);
  const list: string[] = raw ? JSON.parse(raw) : [];
  return list.includes(userId);
}

export function setTourCompleted(userId: string): void {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLETED_TOURS);
  const list: string[] = raw ? JSON.parse(raw) : [];
  if (!list.includes(userId)) {
    list.push(userId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLETED_TOURS, JSON.stringify(list));
  }
}

// Create new user account with genuine E2EE key generation
export async function createNewUserAccount(
  displayName: string,
  username: string,
  avatarUrl: string,
  about: string
): Promise<User> {
  const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Generate RSA key pair for the user
  const { pem } = await generateUserKeyPair();

  const newUser: User = {
    id: userId,
    username: cleanUsername,
    displayName: displayName.trim(),
    avatarUrl: avatarUrl.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
    about: about.trim() || 'Hey there! I am using Ssupp.',
    status: 'online',
    publicKeyPem: pem.publicKeyPem,
    createdAt: Date.now(),
  };

  // Save to stored users
  const users = getStoredUsers();
  users.push(newUser);
  setStoredUsers(users);

  // Save RSA keypairs map
  const existingKeypairs = localStorage.getItem(LOCAL_STORAGE_KEYS.KEYPAIRS);
  const keyMap: Record<string, { publicKeyPem: string; privateKeyPem: string }> = existingKeypairs
    ? JSON.parse(existingKeypairs)
    : {};
  keyMap[userId] = pem;
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEYPAIRS, JSON.stringify(keyMap));

  // Set active user
  setStoredCurrentUser(userId);

  return newUser;
}

// Ensure keypairs for users exist
export async function initializeUserKeyPairs(): Promise<Record<string, { publicKeyPem: string; privateKeyPem: string }>> {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEYS.KEYPAIRS);
  let keyMap: Record<string, { publicKeyPem: string; privateKeyPem: string }> = existing ? JSON.parse(existing) : {};

  const users = getStoredUsers();
  let updatedUsers = false;

  for (const user of users) {
    if (!keyMap[user.id]) {
      const { pem } = await generateUserKeyPair();
      keyMap[user.id] = pem;
      user.publicKeyPem = pem.publicKeyPem;
      updatedUsers = true;
    } else if (!user.publicKeyPem) {
      user.publicKeyPem = keyMap[user.id].publicKeyPem;
      updatedUsers = true;
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.KEYPAIRS, JSON.stringify(keyMap));
  if (updatedUsers) {
    setStoredUsers(users);
  }

  return keyMap;
}

export function getUserPrivateKey(userId: string): string {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEYS.KEYPAIRS);
  if (!existing) return '';
  const map = JSON.parse(existing);
  return map[userId]?.privateKeyPem || '';
}

const CONTACT_NICKNAMES_KEY = 'ssupp_saved_contacts_map';

export function getStoredSavedContacts(currentUserId: string): Record<string, string> {
  const raw = localStorage.getItem(`${CONTACT_NICKNAMES_KEY}_${currentUserId}`);
  return raw ? JSON.parse(raw) : {};
}

export function saveContactNickname(currentUserId: string, contactUserId: string, nickname: string): Record<string, string> {
  const currentMap = getStoredSavedContacts(currentUserId);
  if (nickname.trim()) {
    currentMap[contactUserId] = nickname.trim();
  } else {
    delete currentMap[contactUserId];
  }
  localStorage.setItem(`${CONTACT_NICKNAMES_KEY}_${currentUserId}`, JSON.stringify(currentMap));
  return currentMap;
}
