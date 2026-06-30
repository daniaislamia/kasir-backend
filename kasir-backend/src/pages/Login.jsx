import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        {/* Back to Landing Page */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/" className="text-decoration-none text-muted">
            ← Kembali
          </Link>
          <h2 className="text-center mb-0 flex-grow-1">Kasir App</h2>
          <span style={{ width: '80px' }}></span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary">
              Daftar di sini
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/" className="text-muted text-decoration-none small">
              🏠 Kembali ke Landing Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;