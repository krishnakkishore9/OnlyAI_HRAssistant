"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function ChatWidget({ onFirstMessage }: { onFirstMessage?: () => void }) {
  const { user: authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your OnlyAI HR Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!hasInteracted && onFirstMessage) {
      onFirstMessage();
      setHasInteracted(true);
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          userId: authUser?.uid 
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseDraft = (content: string) => {
    const match = content.match(/\[DRAFT_START\]([\s\S]*?)\[DRAFT_END\]/);
    if (match) {
      try {
        return JSON.parse(match[1].trim());
      } catch (e) {
        console.error("JSON Parse Error in Draft:", e);
        return null;
      }
    }
    return null;
  };

  const handleSendEmail = async (draft: any) => {
    if (isEmailSending) return;
    setIsEmailSending(true);
    console.log("🚀 Processing leave request...", draft);

    try {
      // 1. Run Decision Engine & Save Request
      const leaveRes = await fetch("/api/leave/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authUser?.uid,
          leaveType: draft.params?.leaveType || "Annual Leave",
          startDate: draft.params?.startDate,
          endDate: draft.params?.endDate,
        }),
      });

      const leaveData = await leaveRes.json();
      
      // FIX: Check for 'status' instead of 'approved'
      if (leaveData.status !== "APPROVED") {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: `❌ Request ${leaveData.status}: ${leaveData.reason}` 
        }]);
        setIsEmailSending(false);
        return;
      }

      // 2. If approved, send the email
      const emailRes = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "hr@onlyai.com",
          subject: `${draft.subject} (AUTO-APPROVED)`,
          text: `${draft.body}\n\n--- SYSTEM NOTE: This request has been automatically validated and approved by the OnlyAI Decision Engine.`,
          userId: authUser?.uid
        }),
      });
      
      const emailData = await emailRes.json();
      if (emailData.success) {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: `✅ SUCCESS! Your request for ${draft.params?.leaveType} has been AUTO-APPROVED and sent to HR.` 
        }]);
      } else {
        throw new Error(emailData.error || "Request saved but email failed to send.");
      }
    } catch (error: any) {
      console.error("Leave processing error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: `❌ System Error: ${error.message}` }]);
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass"
            style={{ 
              width: '400px', 
              height: '600px', 
              marginBottom: '1rem', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              overflow: 'hidden'
            }}
          >
            {/* Chat Header */}
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: 'var(--accent-gradient)', padding: '0.5rem', borderRadius: '10px' }}>
                  <Bot size={20} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>OnlyAI Assistant</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Online</p>
                </div>
              </div>
              <X size={20} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setIsOpen(false)} />
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => {
                const draft = msg.role === 'assistant' ? parseDraft(msg.content) : null;
                const cleanContent = msg.content.replace(/\[DRAFT_START\][\s\S]*?\[DRAFT_END\]/, "").trim();

                return (
                  <div key={i} style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '1rem',
                    borderRadius: '16px',
                    background: msg.role === 'user' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)'
                  }}>
                    {cleanContent || msg.content}
                    
                    {draft && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--accent-color)' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent-color)' }}>📧 Formal Leave Request</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.2rem' }}>Type: {draft.params?.leaveType}</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>Dates: {draft.params?.startDate} to {draft.params?.endDate}</p>
                        <button 
                          className="primary" 
                          disabled={isEmailSending}
                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                          onClick={() => handleSendEmail(draft)}
                        >
                          {isEmailSending ? <Loader2 className="animate-spin" size={14} /> : "Validate & Send to HR"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px', fontSize: '0.8rem' }}>
                  AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about HR policies..."
                  style={{ 
                    width: '100%', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid var(--border-color)', 
                    padding: '1rem 3rem 1rem 1rem', 
                    borderRadius: '12px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={handleSend}
                  style={{ 
                    position: 'absolute', 
                    right: '0.5rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    background: 'var(--accent-gradient)',
                    padding: '0.5rem',
                    borderRadius: '8px'
                  }}
                >
                  <Send size={16} color="white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0, 112, 243, 0.4)',
          position: 'relative'
        }}
      >
        {isOpen ? <X color="white" size={24} /> : <MessageSquare color="white" size={24} />}
      </motion.button>
    </div>
  );
}
