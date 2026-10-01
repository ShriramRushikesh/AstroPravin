import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../config';
import { Send, Lock, MessageSquare, ShieldCheck, User } from 'lucide-react';

const MatrimonyChat = ({ userState, myProfile, initialPartnerId }) => {
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(initialPartnerId || null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages(activePartnerId);
    }
  }, [activePartnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setConversations(data || []);
        if (!activePartnerId && data?.length > 0) {
          setActivePartnerId(data[0].partner._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  const fetchMessages = async (partnerId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/chat/messages/${partnerId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartnerId) return;

    try {
      const token = localStorage.getItem('matrimonyToken');
      const res = await fetch(`${API_URL}/api/matrimony/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_profile_id: activePartnerId,
          text: text.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setText('');
      } else {
        alert(data.message || 'Could not send message');
      }
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const activeConv = conversations.find((c) => c.partner?._id === activePartnerId);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl h-[600px] grid grid-cols-1 md:grid-cols-3">
      {/* ── Conversation Sidebar ────────────────────────────────────────────── */}
      <div className="border-r border-white/10 p-4 space-y-3 overflow-y-auto">
        <h3 className="text-sm font-serif font-bold text-white mb-2 flex items-center gap-2">
          <MessageSquare size={16} className="text-purple-400" /> Active Chats
        </h3>

        {conversations.map((c) => {
          const isSelected = c.partner?._id === activePartnerId;
          return (
            <button
              key={c.conversation_id}
              onClick={() => setActivePartnerId(c.partner?._id)}
              className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between ${isSelected ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 font-serif text-xs">
                  {c.partner?.code}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{c.partner?.full_name}</div>
                  <div className="text-[10px] text-white/40 truncate max-w-[120px]">
                    {c.last_message?.text || 'No messages yet'}
                  </div>
                </div>
              </div>

              {c.unread_count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                  {c.unread_count}
                </span>
              )}
            </button>
          );
        })}

        {conversations.length === 0 && (
          <div className="p-6 text-center text-white/30 text-xs">
            No active chats. In-app chat unlocks when both members accept mutual interest!
          </div>
        )}
      </div>

      {/* ── Message Thread Panel ────────────────────────────────────────────── */}
      <div className="col-span-2 flex flex-col justify-between h-full bg-black/20">
        {/* Thread Header */}
        {activeConv ? (
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 font-serif text-xs">
                {activeConv.partner?.code}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{activeConv.partner?.full_name}</h4>
                <p className="text-[10px] text-emerald-400 font-bold">✓ Mutual Interest Accepted</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-white/10 text-xs text-white/40">Select a conversation</div>
        )}

        {/* Message Stream */}
        <div className="p-4 flex-grow overflow-y-auto space-y-3">
          {messages.map((m) => {
            const isMe = m.sender_profile_id === myProfile?._id;
            return (
              <div
                key={m._id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white/10 text-white/90 rounded-bl-none border border-white/10'}`}
                >
                  <p>{m.text}</p>
                  <div className="text-[9px] text-white/40 text-right mt-1 font-mono">
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        {activePartnerId && (
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Send size={14} /> Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MatrimonyChat;
