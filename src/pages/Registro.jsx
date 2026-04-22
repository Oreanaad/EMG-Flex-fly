import React, { useState } from 'react';
import useAuth from '../Context/useAuth'; 
import { useNavigate } from 'react-router-dom';
import '../css/Registro.css'; // <--- Importamos el CSS
import ChickenVisual from './ChickenVisual';


const Registro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Primero, crea un estado para saber si fue exitoso o no
const [isSuccess, setIsSuccess] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      // 1. Establecemos el mensaje de éxito
          setIsSuccess(true);
      setMessage(result.message);
    // <--- Guardamos que fue un éxito

      // 2. Limpiamos los campos del formulario
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // 3. Temporizador para que el mensaje desaparezca en 5 segundos
      setTimeout(() => {
        setMessage('');
      }, 5000);

    } else {
      // Si falla, el mensaje se queda ahí para que el usuario lo lea
        setIsSuccess(false);
      setMessage(result.message);
    }
  };

  return (
    <div className="registro-screen-container">
      
      {/* SECCIÓN IZQUIERDA */}
      <div className="registro-identity-section">
        <div className="chicken-container">
          <ChickenVisual />
        </div>
        <h1 className="registro-title">
          Sign up and manage your <br/>
          <span className="highlight-yellow">Patients</span>
        </h1>
        <p className="registro-subtitle">
          Bionic Rehabilitation Software of Kawatek.
        </p>
      </div>

      {/* SECCIÓN DERECHA */}
      <div className="registro-form-section">
        <div className="registro-card">
          <h2 className="registro-card-title">Sign up</h2>

          <form onSubmit={handleSubmit}>
            <div className="registro-form-flex">
              <div className="input-group">
                <label className="input-label">Email</label>
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="registro-input"
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
                  placeholder="Your password"
                  className="registro-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="registro-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="registro-button"
              >
                {loading ? 'Processing...' : 'Sign up'}
              </button>

            

                          
             
{message && (
  <p className={`form-message ${isSuccess ? 'success' : 'error'}`}>
    {message}
  </p>
)}
              <div className="form-links">
                <p>
                  <span 
                    onClick={() => navigate('/Login')} 
                    className="link-text"
                  >
                    Already with us? Sign in!
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

export default Registro;