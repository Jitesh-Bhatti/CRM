import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterOrganization } from '../hooks/useRegisterOrganization';

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

export const RegisterOrganizationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    organization_name: '',
    owner_name: '',
    owner_email: '',
    password: '',
  });

  const [focused, setFocused] = useState<string | null>(null);
  const { mutate: register, isPending, isError, error } = useRegisterOrganization();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData, {
      onSuccess: () => {
        // Redirect to login page upon successful registration
        navigate('/login');
      }
    });
  };

  const getFocusStyle = (name: string): React.CSSProperties =>
    focused === name
      ? { borderColor: '#2563eb', boxShadow: '0 0 0 3px rgba(37,99,235,0.12)', background: '#fff' }
      : {};

  const getErrorMessage = () => {
    if (!error) return 'Registration failed. Please try again.';
    // Attempt to extract server error message via axios response structure
    const err = error as any;
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    return err.message || 'Registration failed. Please try again.';
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>

      {/* Organization Name */}
      <div>
        <label style={labelStyle}>
          🏢 Organization Name
        </label>
        <input
          type="text"
          name="organization_name"
          required
          value={formData.organization_name}
          onChange={handleChange}
          onFocus={() => setFocused('organization_name')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('organization_name') }}
          placeholder="Acme Corp"
        />
      </div>

      {/* Owner Name */}
      <div>
        <label style={labelStyle}>
          👤 Your Name
        </label>
        <input
          type="text"
          name="owner_name"
          required
          value={formData.owner_name}
          onChange={handleChange}
          onFocus={() => setFocused('owner_name')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('owner_name') }}
          placeholder="John Doe"
        />
      </div>

      {/* Work Email */}
      <div>
        <label style={labelStyle}>
          ✉️ Work Email
        </label>
        <input
          type="email"
          name="owner_email"
          required
          value={formData.owner_email}
          onChange={handleChange}
          onFocus={() => setFocused('owner_email')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('owner_email') }}
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
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, ...getFocusStyle('password') }}
          placeholder="Min. 8 characters"
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
            Creating Account...
          </>
        ) : (
          '🚀 Create Organization'
        )}
      </button>
    </form>
  );
};
