import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username && password) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            username,
            password
          }),
          credentials: 'include' // si vas a usar cookies httpOnly
        });

        if (!response.ok) {
          throw new Error('Credenciales incorrectas');
        }

        // Si usás cookie httpOnly no hay token acá
        // const data = await response.json();
        // localStorage.setItem('token', data.access_token);

        window.location.href = '/inicio';
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Función de recuperación de contraseña - Aquí implementarías la lógica correspondiente');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Función de registro - Aquí redirigirías a la página de registro');
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
          <a href="/" onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</a>
        </div>
      </form>

      <div className="register-section">
        <p>¿No tienes una cuenta?</p>
        <a href="/" className="register-btn" onClick={handleRegister}>Registrarse</a>
      </div>
    </div>
  );
};

export default Login;
