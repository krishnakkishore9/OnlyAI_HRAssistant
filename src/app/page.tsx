"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, MessageSquare } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { useAuth, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading) return null;

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>OnlyAI <span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>Assistant</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enterprise HR Portal</p>
        </div>
        <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <UserIcon size={20} color="var(--accent-color)" />
          <span>{user?.email}</span>
          <button 
            onClick={handleLogout}
            style={{ background: 'transparent', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Generic Landing Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div className="glass" style={{ padding: '4rem', maxWidth: '800px' }}>
            <div style={{ background: 'var(--accent-gradient)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <MessageSquare size={40} color="white" />
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Your HR Assistant is Ready</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Ask about leave policies, check your balances, or request time off. Your personal assistant handles everything securely.
            </p>
            
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.6 }}>
              <div style={{ fontSize: '0.9rem' }}>🛡️ Secure Data Access</div>
              <div style={{ fontSize: '0.9rem' }}>⚡ Real-time Policy Logic</div>
              <div style={{ fontSize: '0.9rem' }}>📧 Automated HR Sync</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat Widget stays as the primary interaction point */}
      <ChatWidget />
    </main>
  );
}
