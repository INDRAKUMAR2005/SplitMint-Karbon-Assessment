import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GroupView from './pages/GroupView';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setActiveGroup(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav>
        <div className="logo" onClick={() => setActiveGroup(null)} style={{ cursor: 'pointer' }}>
          SplitMint
        </div>
        {session && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="container">
        {!session ? (
          <Login />
        ) : (
          activeGroup ? (
            <GroupView group={activeGroup} onBack={() => setActiveGroup(null)} />
          ) : (
            <Dashboard onSelectGroup={(g) => setActiveGroup(g)} />
          )
        )}
      </main>
    </>
  );
}

export default App;
