import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username && password) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            username,
            password
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Credenciales incorrectas');
        }

        // Redirigimos si fue exitoso
        window.location.href = '/';

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckLoginStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('No autenticado');
      }

      const data = await response.json();
      setLoggedInUser(data.usuario.nombre);
      alert(`Estás autenticado como: ${data.usuario.nombre}`);
    } catch (err) {
      alert('No estás logueado o hubo un error: ' + err.message);
      setLoggedInUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/v1/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setLoggedInUser(null);
      alert('Sesión cerrada');
    } catch (err) {
      alert('Error al cerrar sesión: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Ingresa tu usuario"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div className="form-links">
          <a href="/" onClick={(e) => {
            e.preventDefault();
            alert('Función de recuperación de contraseña pendiente.');
          }}>¿Olvidaste tu contraseña?</a>
        </div>
      </form>

      <div className="register-section">
        <p>¿No tienes una cuenta?</p>
        <a href="/" className="register-btn" onClick={(e) => {
          e.preventDefault();
          alert('Función de registro pendiente.');
        }}>Registrarse</a>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleCheckLoginStatus} className="login-btn" style={{ marginRight: '1rem' }}>
          Verificar si estoy logueado
        </button>

        <button onClick={handleLogout} className="login-btn logout">
          Cerrar sesión
        </button>

        {loggedInUser && <p style={{ marginTop: '1rem' }}>Sesión activa como: <strong>{loggedInUser}</strong></p>}
      </div>
    </div>
  );
};

export default Login;
