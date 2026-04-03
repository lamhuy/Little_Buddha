import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name, parseInt(birthYear, 10));
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="card">
        <h2>Sign Up</h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input className="input-field" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input-field" type="number" placeholder="Birth Year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} required />
          <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
