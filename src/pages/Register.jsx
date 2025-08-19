// Register.jsx
import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = password => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
  };

  const isPasswordValid = pass => {
    const checks = validatePassword(pass);
    return Object.values(checks).every(Boolean);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;
    let valid = true;
    const newErrors = {};
    const newSuccess = {};

    if (username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Solo se permiten letras, números y guiones bajos';
      valid = false;
    } else {
      newSuccess.username = true;
    }

    if (!isPasswordValid(password)) {
      newErrors.password = 'La contraseña no cumple los requisitos';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    } else if (password && confirmPassword) {
      newSuccess.confirmPassword = true;
    }

    setErrors(newErrors);
    setSuccess(newSuccess);

    if (valid) {
      alert(`¡Cuenta creada exitosamente!\nBienvenido, ${username}!`);
      console.log('Usuario registrado:', { username, password });
      // Reset form
      setFormData({ username: '', password: '', confirmPassword: '' });
      setSuccess({});
    }
  };

  const reqs = validatePassword(formData.password);

  return (
    <div className="register-container">
      <div className="header">
        <button className="back-arrow" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Crear Cuenta</h1>
        <p>Únete a nuestra comunidad</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.username ? 'error' : success.username ? 'success' : ''}`}>
          <label htmlFor="username">Nombre de usuario *</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
          {errors.username && <div className="error-message">{errors.username}</div>}
          {success.username && <div className="success-message">✓ Nombre de usuario disponible</div>}
        </div>

        <div className={`form-group ${errors.password ? 'error' : isPasswordValid(formData.password) ? 'success' : ''}`}>
          <label htmlFor="password">Contraseña *</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <div className="error-message">{errors.password}</div>}
          <div className="password-requirements">
            <h4>Requisitos de la contraseña:</h4>
            <div className={`requirement ${reqs.length ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{reqs.length ? '✓' : '○'}</span> Al menos 8 caracteres
            </div>
            <div className={`requirement ${reqs.uppercase ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{reqs.uppercase ? '✓' : '○'}</span> Una letra mayúscula
            </div>
            <div className={`requirement ${reqs.lowercase ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{reqs.lowercase ? '✓' : '○'}</span> Una letra minúscula
            </div>
            <div className={`requirement ${reqs.number ? 'valid' : 'invalid'}`}>
              <span className="requirement-icon">{reqs.number ? '✓' : '○'}</span> Un número
            </div>
          </div>
        </div>

        <div className={`form-group ${errors.confirmPassword ? 'error' : success.confirmPassword ? 'success' : ''}`}>
          <label htmlFor="confirmPassword">Confirmar contraseña *</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          {success.confirmPassword && <div className="success-message">✓ Las contraseñas coinciden</div>}
        </div>

        <button type="submit" className="register-btn">Crear Cuenta</button>
      </form>

      <div className="login-section">
        <p>¿Ya tienes una cuenta?</p>
        <a href="#" className="login-btn" onClick={(e) => { e.preventDefault(); alert("Función de login aún no implementada"); }}>
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
};

export default Register;
