import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User, Check, CheckCheck, Clock } from 'lucide-react';
import { matrimonyApi } from '../../../services/matrimonyApi';
import { API_URL } from '../../../config';

const MatrimonyChat = ({ initialPartnerId }) => {
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(initialPartnerId || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const convs = await matrimonyApi.getConversations();
      setConversations(convs);
      if (!activePartnerId && convs.length > 0) {
        setActivePartnerId(convs[0].partnerProfile?.userId || convs[0].partnerProfile?._id);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    if (!partnerId) return;
    try {
      const res = await matrimonyApi.getMessages(partnerId);
      setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages(activePartnerId);
      const interval = setInterval(() => fetchMessages(activePartnerId), 4000); // 4-sec polling fallback
      return () => clearInterval(interval);
    }
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId || sending) return;

    const text = inputText;
    setInputText('');
    setSending(true);

    try {
      const newMsg = await matrimonyApi.sendMessage(activePartnerId, text);
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find(
    c => (c.partnerProfile?.userId || c.partnerProfile?._id) === activePartnerId
  );
  const partnerProfile = activeConversation?.partnerProfile;

  return (
    <div className="bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl h-[75vh] flex flex-col md:flex-row">
      {/* ── Left Sidebar: Conversations ─────────────────────────────────── */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
            <MessageSquare size={16} className="text-amber-400" />
            <span>Mutual Match Messages</span>
          </h3>
          <p className="text-[10px] text-white/40 mt-0.5">Chat unlocked for accepted mutual interests</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {loading ? (
            <div className="p-8 text-center text-xs text-white/40">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-white/40">
              No mutual matches yet. When an interest is mutually accepted, chat opens here!
            </div>
          ) : (
            conversations.map((conv) => {
              const p = conv.partnerProfile;
              const pId = p.userId || p._id;
              const isActive = pId === activePartnerId;
              const photo = p.photos?.[0];
              const photoUrl = photo ? `${API_URL}${photo.url}` : '/assets/avatar-placeholder.png';

              return (
                <div
                  key={pId}
                  onClick={() => setActivePartnerId(pId)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-amber-500/15 border-l-2 border-amber-400' : 'hover:bg-white/5'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={p.fullName}
                    className="w-11 h-11 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-serif font-bold text-white truncate">{p.fullName}</h4>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-bold rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">
                      {conv.lastMessage?.message || 'Start chatting...'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Panel: Message Feed ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-black/20">
        {partnerProfile ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={partnerProfile.photos?.[0] ? `${API_URL}${partnerProfile.photos[0].url}` : '/assets/avatar-placeholder.png'}
                    alt="Partner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">{partnerProfile.fullName}</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Mutual Match Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-xs text-white/30">
                  Send a respectful greeting to begin your conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = (msg.receiverId === activePartnerId) || (msg.senderId !== activePartnerId);
                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-medium rounded-br-none shadow-md'
                            : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-white/30 mt-1 px-1">
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={11} className="text-blue-400" /> : <Check size={11} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black rounded-xl hover:brightness-110 disabled:opacity-30 transition-all"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-white/30">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MatrimonyChat);
