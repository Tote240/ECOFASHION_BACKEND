// Register.js
import React, { useState } from 'react';
import { auth } from './Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './login-registro.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from || '/';
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');
  
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate(from, { replace: true });
      } catch (error) {
        let errorMessage = 'Ocurrió un error al registrarse';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'Ya existe una cuenta con este correo electrónico';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'El correo electrónico no es válido';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="auth-container">
        <header className="auth-header">
        </header>
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            
          <h2 className="navbar-brand fs-3 fw-bold mb-0 text-BLACK">REGISTRO</h2>
            <form className="auth-form" onSubmit={handleRegister}>
              <input
                type="email"
                className="auth-input"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="password"
                className="auth-input"
                placeholder="Acceso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
  
              {error && <div className="auth-error">{error}</div>}
  
              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-loading-spinner"></span>
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
  
              <Link to="/login" className="auth-toggle-link">
                o inicia sesión
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  export default Register;