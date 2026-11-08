import React, { useEffect, useState } from 'react';
import {
  User,
  Chat,
  Message,
  FriendRequest,
  CallLog,
  Sticker,
} from './types';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredUsers,
  setStoredUsers,
  getStoredRequests,
  setStoredRequests,
  getStoredChats,
  setStoredChats,
  getStoredMessages,
  setStoredMessages,
  getStoredCalls,
  setStoredCalls,
  getStoredStickers,
  setStoredStickers,
  initializeUserKeyPairs,
  getUserPrivateKey,
  getStoredSavedContacts,
  saveContactNickname,
  logoutUser,
  hasCompletedTour,
  setTourCompleted,
} from './utils/storage';
import { encryptText, decryptText } from './utils/crypto';
import { realtimeSync } from './utils/realtimeSync';

import { Sidebar } from './components/Sidebar';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { InstagramRequestsModal } from './components/InstagramRequestsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CallModal } from './components/CallModal';
import { E2EESafetyCodeModal } from './components/E2EESafetyCodeModal';
import { EditContactNameModal } from './components/EditContactNameModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingTourModal } from './components/OnboardingTourModal';
import { SaveLoginInfoModal } from './components/SaveLoginInfoModal';
import { UpdatesTab } from './components/UpdatesTab';
import { CallsHistoryTab } from './components/CallsHistoryTab';
import { ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [savedContactNames, setSavedContactNames] = useState<Record<string, string>>({});
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Navigation states
  const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'updates' | 'calls' | 'settings'>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Modal states
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSafetyCodeModal, setShowSafetyCodeModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showSaveInfoModal, setShowSaveInfoModal] = useState(false);

  // Active Voice/Video Call state
  const [activeCall, setActiveCall] = useState<{
    contactUser: User;
    type: 'voice' | 'video';
    isIncoming?: boolean;
  } | null>(null);

  // Initialize storage & E2EE keypairs on mount
  useEffect(() => {
    async function initApp() {
      await initializeUserKeyPairs();
      const users = getStoredUsers();
      const currentUserId = getStoredCurrentUser();
      const curUser = users.find((u) => u.id === currentUserId) || null;

      setAllUsers(users);
      setCurrentUser(curUser);
      setRequests(getStoredRequests());
      setChats(getStoredChats());
      setMessages(getStoredMessages());
      setCallLogs(getStoredCalls());
      setStickers(getStoredStickers());

      if (curUser && !hasCompletedTour(curUser.id)) {
        setShowTourModal(true);
      }
    }

    initApp();
  }, []);

  // Listen to realtime cross-tab broadcast events
  useEffect(() => {
    const unsubMsg = realtimeSync.subscribe('new_message', (newMsg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        const updated = [...prev, newMsg];
        setStoredMessages(updated);
        return updated;
      });
    });

    const unsubReq = realtimeSync.subscribe('requests_updated', (newReqs: FriendRequest[]) => {
      setRequests(newReqs);
      setStoredRequests(newReqs);
    });

    const unsubChats = realtimeSync.subscribe('chats_updated', (newChats: Chat[]) => {
      setChats(newChats);
      setStoredChats(newChats);
    });

    return () => {
      unsubMsg();
      unsubReq();
      unsubChats();
    };
  }, []);

  // Load saved contact nicknames for current user
  useEffect(() => {
    if (currentUser) {
      setSavedContactNames(getStoredSavedContacts(currentUser.id));
    }
  }, [currentUser]);

  // Synchronize Theme Effect
  useEffect(() => {
    const storedTheme = (localStorage.getItem('ssupp_theme') as 'dark' | 'light') || 'dark';
    setCurrentTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    localStorage.setItem('ssupp_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const handleSaveContactName = (customName: string) => {
    if (!currentUser || !activeContact) return;
    const updated = saveContactNickname(currentUser.id, activeContact.id, customName);
    setSavedContactNames(updated);
  };

  const handleAccountCreated = (newUser: User) => {
    const users = getStoredUsers();
    setAllUsers(users);
    setCurrentUser(newUser);
    setShowTourModal(true);
    if (!localStorage.getItem('ssupp_save_info_choice')) {
      setShowSaveInfoModal(true);
    }
  };

  const handleSelectExistingUser = (user: User) => {
    setCurrentUser(user);
    setStoredCurrentUser(user.id);
    if (!localStorage.getItem('ssupp_save_info_choice')) {
      setShowSaveInfoModal(true);
    }
  };

  const handleConfirmSaveInfo = () => {
    if (currentUser) {
      localStorage.setItem('ssupp_save_info_choice', 'saved');
      setStoredCurrentUser(currentUser.id);
    }
    setShowSaveInfoModal(false);
  };

  const handleSkipSaveInfo = () => {
    localStorage.setItem('ssupp_save_info_choice', 'skipped');
    setShowSaveInfoModal(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleFinishTour = () => {
    if (currentUser) {
      setTourCompleted(currentUser.id);
    }
    setShowTourModal(false);
  };

  if (!currentUser) {
    return (
      <AuthModal
        allUsers={allUsers}
        onAccountCreated={handleAccountCreated}
        onSelectExistingUser={handleSelectExistingUser}
      />
    );
  }

  // Active Chat & Contact
  const currentChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const activeContactId = currentChat?.participantIds.find((id) => id !== currentUser.id);
  const activeContact = allUsers.find((u) => u.id === activeContactId);

  // Filter messages for active chat
  const activeMessages = messages.filter((m) => m.chatId === currentChat?.id);

  // Send Message with End-to-End Encryption
  const handleSendMessage = async (
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string,
    extraProps: Partial<Message> = {}
  ) => {
    if (!currentChat || !activeContact) return;

    // Encrypt content using recipient's public key
    const recipientKeyPem = activeContact.publicKeyPem || '';
    const { ciphertext, iv } = await encryptText(content, recipientKeyPem);

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      chatId: currentChat.id,
      senderId: currentUser.id,
      recipientId: activeContact.id,
      type,
      content, // Decrypted local view
      encryptedCiphertext: ciphertext,
      iv,
      mediaUrl,
      reactions: {},
      status: 'sent',
      timestamp: Date.now(),
      ...extraProps,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setStoredMessages(updatedMessages);

    // Update last message in chat
    const updatedChats = chats.map((c) => {
      if (c.id === currentChat.id) {
        return {
          ...c,
          lastMessage: newMsg,
          updatedAt: Date.now(),
        };
      }
      return c;
    });
    setChats(updatedChats);
    setStoredChats(updatedChats);

    // Broadcast across tabs
    realtimeSync.broadcast('new_message', newMsg);
    realtimeSync.broadcast('chats_updated', updatedChats);
  };

  // React to message with emoji
  const handleReactMessage = (messageId: string, emoji: string) => {
    const updatedMessages = messages.map((m) => {
      if (m.id === messageId) {
        const reactions = { ...m.reactions };
        if (!reactions[emoji]) reactions[emoji] = [];
        if (!reactions[emoji].includes(currentUser.id)) {
          reactions[emoji].push(currentUser.id);
        } else {
          reactions[emoji] = reactions[emoji].filter((id) => id !== currentUser.id);
        }
        return { ...m, reactions };
      }
      return m;
    });

    setMessages(updatedMessages);
    setStoredMessages(updatedMessages);
  };

  // Instagram-style Friend Request Handlers
  const handleSendRequest = (receiverId: string, message: string) => {
    const newReq: FriendRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      status: 'pending',
      message,
      createdAt: Date.now(),
    };

    const updated = [...requests, newReq];
    setRequests(updated);
    setStoredRequests(updated);
    realtimeSync.broadcast('requests_updated', updated);
  };

  const handleAcceptRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    );

    setRequests(updatedRequests);
    setStoredRequests(updatedRequests);

    // Create chat if doesn't exist
    const existingChat = chats.find(
      (c) =>
        c.participantIds.includes(req.senderId) &&
        c.participantIds.includes(req.receiverId)
    );

    if (!existingChat) {
      const newChat: Chat = {
        id: `chat_${req.senderId}_${req.receiverId}`,
        participantIds: [req.senderId, req.receiverId],
        type: 'direct',
        unreadCounts: { [req.senderId]: 0, [req.receiverId]: 0 },
        updatedAt: Date.now(),
      };

      const updatedChats = [newChat, ...chats];
      setChats(updatedChats);
      setStoredChats(updatedChats);
      setActiveChatId(newChat.id);
      realtimeSync.broadcast('chats_updated', updatedChats);
    } else {
      setActiveChatId(existingChat.id);
    }

    setShowRequestsModal(false);
    setActiveTab('chats');
  };

  const handleDeclineRequest = (requestId: string) => {
    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'declined' as const } : r
    );
    setRequests(updatedRequests);
    setStoredRequests(updatedRequests);
  };

  // User Profile DP Update
  const handleUpdateUserProfile = (updated: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);

    const updatedUsersList = allUsers.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    setAllUsers(updatedUsersList);
    setStoredUsers(updatedUsersList);
  };

  // Switch Active User (Testing helper)
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setStoredCurrentUser(user.id);
  };

  // Voice / Video Call Callbacks
  const handleStartCall = (contact: User, type: 'voice' | 'video') => {
    setActiveCall({ contactUser: contact, type, isIncoming: false });
  };

  const handleEndCall = (durationSeconds: number) => {
    if (activeCall) {
      const newCallLog: CallLog = {
        id: `call_${Date.now()}`,
        callerId: currentUser.id,
        receiverId: activeCall.contactUser.id,
        type: activeCall.type,
        status: 'completed',
        durationSeconds,
        timestamp: Date.now(),
        isEncrypted: true,
      };
      const updatedLogs = [newCallLog, ...callLogs];
      setCallLogs(updatedLogs);
      setStoredCalls(updatedLogs);
    }
    setActiveCall(null);
  };

  const totalUnreadChats = chats.reduce(
    (acc, c) => acc + (c.unreadCounts[currentUser.id] || 0),
    0
  );

  const pendingRequestsCount = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'pending'
  ).length;

  return (
    <div className="flex h-screen w-screen bg-[#0b141a] text-slate-100 overflow-hidden font-sans select-none">
      {/* WhatsApp Sidebar Navigation Rail */}
      <Sidebar
        currentUser={currentUser}
        allUsers={allUsers}
        requests={requests}
        activeTab={activeTab}
        currentTheme={currentTheme}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'requests') setShowRequestsModal(true);
        }}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenRequestsModal={() => setShowRequestsModal(true)}
        onSwitchUser={handleSwitchUser}
        onOpenTour={() => setShowTourModal(true)}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        totalUnreadChats={totalUnreadChats}
      />

      {/* Main Workspace Views */}
      {activeTab === 'updates' ? (
        <UpdatesTab currentUser={currentUser} friends={allUsers.filter((u) => u.id !== currentUser.id)} />
      ) : activeTab === 'calls' ? (
        <CallsHistoryTab
          currentUser={currentUser}
          allUsers={allUsers}
          callLogs={callLogs}
          onStartCall={handleStartCall}
        />
      ) : (
        /* Default Dual Panel View: Chat List + Active Chat Window */
        <div className="flex-1 flex h-full overflow-hidden">
          <ChatList
            chats={chats}
            currentUser={currentUser}
            allUsers={allUsers}
            savedContactNames={savedContactNames}
            messages={messages}
            activeChatId={activeChatId}
            onSelectChat={(id) => setActiveChatId(id)}
            onOpenRequestsModal={() => setShowRequestsModal(true)}
            pendingRequestsCount={pendingRequestsCount}
          />

          {currentChat && activeContact ? (
            <ChatWindow
              chat={currentChat}
              currentUser={currentUser}
              contactUser={activeContact}
              savedContactName={savedContactNames[activeContact.id]}
              messages={activeMessages}
              stickers={stickers}
              onSendMessage={handleSendMessage}
              onReactMessage={handleReactMessage}
              onStartCall={handleStartCall}
              onOpenSafetyCode={() => setShowSafetyCodeModal(true)}
              onOpenEditContactName={() => setShowEditContactModal(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0b141a] text-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#111b21] flex items-center justify-center text-[#00a884] border border-[#00a884]/30 shadow-2xl">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Ssupp for Web</h2>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Send end-to-end encrypted messages, photos, stickers, and make voice & video calls. Discover friends using Instagram-style @usernames.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}

      {/* Save Login Info Modal */}
      {showSaveInfoModal && currentUser && (
        <SaveLoginInfoModal
          displayName={currentUser.displayName}
          avatarUrl={currentUser.avatarUrl}
          onConfirmSaveInfo={handleConfirmSaveInfo}
          onSkipSaveInfo={handleSkipSaveInfo}
        />
      )}

      {/* Onboarding Tour Modal */}
      {showTourModal && currentUser && (
        <OnboardingTourModal
          userName={currentUser.displayName}
          onFinishTour={handleFinishTour}
        />
      )}

      {/* 1. Instagram Username Requests Modal */}
      {showRequestsModal && (
        <InstagramRequestsModal
          currentUser={currentUser}
          allUsers={allUsers}
          requests={requests}
          onSendRequest={handleSendRequest}
          onAcceptRequest={handleAcceptRequest}
          onDeclineRequest={handleDeclineRequest}
          onClose={() => setShowRequestsModal(false)}
        />
      )}

      {/* 2. User Profile & DP Setup Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={currentUser}
          currentTheme={currentTheme}
          onUpdateUser={handleUpdateUserProfile}
          onToggleTheme={handleToggleTheme}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* 3. 60-digit E2EE Security Code Verification Modal */}
      {showSafetyCodeModal && currentUser && activeContact && (
        <E2EESafetyCodeModal
          currentUser={currentUser}
          contactUser={activeContact}
          onClose={() => setShowSafetyCodeModal(false)}
        />
      )}

      {/* 4. Edit / Save Contact Name Modal */}
      {showEditContactModal && currentUser && activeContact && (
        <EditContactNameModal
          contactUser={activeContact}
          currentSavedName={savedContactNames[activeContact.id] || ''}
          onSaveContactName={handleSaveContactName}
          onClose={() => setShowEditContactModal(false)}
        />
      )}

      {/* 5. WhatsApp Voice & Video Call Overlay */}
      {activeCall && (
        <CallModal
          currentUser={currentUser}
          contactUser={activeCall.contactUser}
          callType={activeCall.type}
          isIncoming={activeCall.isIncoming}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}
