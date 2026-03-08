import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '../../../store/useAuthStore';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: '#e2e8f0',
  borderRadius: '10px',
  fontSize: '15px',
  color: '#0f172a',
  background: '#f8fafc',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: "'Inter', sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
  letterSpacing: '0.01em',
};

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const { mutate: login, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // The moment isAuthenticated becomes true, redirect to Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const getFocusStyle = (name: string): React.CSSProperties =>
    focused === name
      ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.12)', background: '#fff' }
      : {};

  const getErrorMessage = () => {
    if (!error) return 'Login failed. Please try again.';
    const err = error as any;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    return err.message || 'Login failed. Please try again.';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>

      {/* Email */}
      <div>
        <label style={labelStyle}>
          ✉️ Work Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('email') }}
          placeholder="john@acmecorp.com"
        />
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>
          🔒 Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('password') }}
          placeholder="••••••••"
        />
      </div>

      {/* Error */}
      {isError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 14px', borderRadius: '10px',
          background: '#fef2f2', border: '1px solid #fecaca',
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>
            {getErrorMessage()}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          background: isPending
            ? '#93c5fd'
            : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: 700,
          cursor: isPending ? 'not-allowed' : 'pointer',
          letterSpacing: '0.01em',
          boxShadow: isPending ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
          transition: 'all 0.2s ease',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={e => {
          if (!isPending) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }}
      >
        {isPending ? (
          <>
            <span style={{
              width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff', borderRadius: '50%',
              display: 'inline-block', animation: 'spin 0.7s linear infinite',
            }} />
            Signing in...
          </>
        ) : (
          '🚀 Sign In'
        )}
      </button>
    </form>
  );
};