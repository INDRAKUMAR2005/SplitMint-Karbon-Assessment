import React, { useState } from 'react';
import { supabase } from '../supabase';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let error;

    if (isRegister) {
      // Supabase Registration
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      error = signUpError;
      
      if (!error) {
        alert('Registration successful! Check your email to confirm if email confirmations are enabled.');
      }
    } else {
      // Supabase Login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      error = signInError;
    }

    if (error) {
      setErrorMsg(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '6rem auto' }} className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '24px' }}>
        {isRegister ? 'Create Account' : 'Welcome back'}
      </h2>
      
      {errorMsg && (
        <div style={{ background: 'var(--danger-muted, rgba(243, 18, 96, 0.1))', color: 'var(--danger)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your Name" 
            />
          </div>
        )}
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@example.com" 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '24px' }}>
          {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign In')}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}
        </span>
        <button 
          onClick={() => { setIsRegister(!isRegister); setErrorMsg(null); }} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginLeft: '6px', fontWeight: 500, textDecoration: 'underline' }}
        >
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
      </div>
    </div>
  );
}

export default Login;
