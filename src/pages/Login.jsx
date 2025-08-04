import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      setLoading(true);
      setTimeout(() => {
        alert(`¡Bienvenido, ${username}!`);
        setLoading(false);
      }, 1500);
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
