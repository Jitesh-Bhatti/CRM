import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel - Brand */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1d4ed8 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '60px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', bottom: '120px', right: '30px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 4px 16px rgba(96,165,250,0.4)',
          }}>⚡</div>
          <span style={{ color: '#fff', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            CRM<span style={{ color: '#60a5fa' }}>Pro</span>
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          color: '#ffffff', fontSize: '36px', fontWeight: 800,
          lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.5px',
        }}>
          Welcome back to<br />
          <span style={{ color: '#93c5fd' }}>your workspace</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, maxWidth: '320px', marginBottom: '48px' }}>
          Sign in to pick up right where you left off. Access your clients, projects, and team updates.
        </p>

        {/* Feature bullets */}
        {[
          { icon: '🚀', text: 'Fast & Secure Login' },
          { icon: '🔒', text: 'Enterprise-grade encryption' },
          { icon: '💼', text: 'Seamless workflow continuation' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#60a5fa', fontSize: '12px', fontWeight: 700, flexShrink: 0,
            }}>{item.icon}</div>
            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '28px', fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.5px', marginBottom: '8px',
            }}>Sign In</h2>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Register */}
          <p style={{ marginTop: '28px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >Create an Organization</Link>
          </p>

          {/* Footer note */}
          <p style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
            By signing in, you agree to our{' '}
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Terms of Service</span>
            {' & '}
            <span style={{ color: '#64748b', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};