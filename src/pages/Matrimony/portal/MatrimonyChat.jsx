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
      const interval = setInterval(() => fetchMessages(activePartnerId), 4000); // 4-sec polling
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
    <div className="bg-white border border-[#EADCC8] rounded-3xl overflow-hidden shadow-sm h-[75vh] flex flex-col md:flex-row">
      {/* ── Left Sidebar: Conversations ─────────────────────────────────── */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#EADCC8] bg-[#FAF8F5] flex flex-col">
        <div className="p-4 border-b border-[#EADCC8]">
          <h3 className="text-sm font-serif font-bold text-[#1C1917] flex items-center gap-2">
            <MessageSquare size={16} className="text-[#C2410C]" />
            <span>Mutual Match Messages</span>
          </h3>
          <p className="text-[10px] text-[#78716C] mt-0.5">Chat unlocked for accepted mutual interests</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#F5EFE6]">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#78716C]">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78716C] leading-relaxed">
              No mutual matches yet. When an interest is mutually accepted, direct chat opens here!
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
                    isActive ? 'bg-white border-l-3 border-[#C2410C] shadow-xs' : 'hover:bg-[#F5EFE6]/60'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={p.fullName}
                    className="w-11 h-11 rounded-xl object-cover bg-white border border-[#EADCC8] shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-serif font-bold text-[#1C1917] truncate">{p.fullName}</h4>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#C2410C] text-white text-[9px] font-bold rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#78716C] truncate mt-0.5">
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
      <div className="flex-1 flex flex-col bg-white">
        {partnerProfile ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#EADCC8] bg-[#FAF8F5]/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#EADCC8]">
                  <img
                    src={partnerProfile.photos?.[0] ? `${API_URL}${partnerProfile.photos[0].url}` : '/assets/avatar-placeholder.png'}
                    alt="Partner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#1C1917]">{partnerProfile.fullName}</h3>
                  <span className="text-[10px] text-[#15803D] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    Mutual Match Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]/40">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-xs text-[#78716C]">
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
                            ? 'bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white font-medium rounded-br-none shadow-sm'
                            : 'bg-white text-[#1C1917] rounded-bl-none border border-[#EADCC8] shadow-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-[#A8A29E] mt-1 px-1">
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={11} className="text-[#2563EB]" /> : <Check size={11} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-[#EADCC8] bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#FAF8F5] border border-[#EADCC8] focus:border-[#C2410C] focus:bg-white rounded-xl py-2.5 px-4 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="p-2.5 bg-gradient-to-r from-[#C2410C] to-[#EA580C] text-white rounded-xl hover:brightness-105 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#78716C]">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MatrimonyChat);
