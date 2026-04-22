import React, { useState } from 'react';
import useAuth from '../Context/useAuth';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // <--- Importamos el archivo CSS
import ChickenVisual from './ChickenVisual';

const BionicLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); 
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const result = await login(email, password); 
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      navigate('/dashboard'); 
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="login-screen-container">
      
      {/* SECCIÓN IZQUIERDA: Identidad */}
      <div className="login-identity-section">
        <div className="chicken-container">
          <ChickenVisual />
        </div>
        <h1 className="login-title">
          Log in and manage your <br/>
          <span className="highlight-yellow">Patients</span>
        </h1>
        <p className="login-subtitle">
          Bionic Rehabilitation Software of Kawatek.
        </p>
      </div>

      {/* SECCIÓN DERECHA: Formulario */}
      <div className="login-form-section">
        <div className="login-card">
          <h2 className="login-card-title">Log in</h2>

          <form onSubmit={handleSubmit}>
            <div className="login-form-flex">
              <div className="input-group">
                <label className="input-label">Email</label>
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="login-input"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Your password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                onClick={onLoginSuccess}
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

             
              {message && (
                <p className={`form-message ${message.includes('Redirecting...') || message.includes('éxito') ? 'success' : 'error'}`}>
                  {message}
                </p>
              )}
             
              <div className="form-links">
                <p>
                  <span 
                    onClick={() => navigate('/registro')} 
                    className="link-text"
                  >
                    Doesn't have an account? Sign up!
                  </span>
                </p>
              </div>  
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BionicLogin;