import React, { useState } from 'react';
import '../styles/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessages, setSuccessMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validación específica por campo
    if (name === 'username') {
      validateUsername(value);
    } else if (name === 'password') {
      validatePassword(value);
      // Revalidar confirmación si ya existe
      if (formData.confirmPassword) {
        validateConfirmPassword(value, formData.confirmPassword);
      }
    } else if (name === 'confirmPassword') {
      validateConfirmPassword(formData.password, value);
    }
  };

  // Validar nombre de usuario
  const validateUsername = (username) => {
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 3) {
      setErrors(prev => ({
        ...prev,
        username: 'El nombre de usuario debe tener al menos 3 caracteres'
      }));
      setSuccessMessages(prev => ({ ...prev, username: false }));
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setErrors(prev => ({
        ...prev,
        username: 'Solo se permiten letras, números y guiones bajos'
      }));
      setSuccessMessages(prev => ({ ...prev, username: false }));
    } else {
      setErrors(prev => ({ ...prev, username: '' }));
      setSuccessMessages(prev => ({ ...prev, username: true }));
    }
  };

  // Validar contraseña
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };

    setPasswordRequirements(requirements);

    const allValid = Object.values(requirements).every(req => req);
    
    if (password.length > 0 && !allValid) {
      setErrors(prev => ({ ...prev, password: 'invalid' }));
    } else if (allValid) {
      setErrors(prev => ({ ...prev, password: '' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }

    return allValid;
  };

  // Validar confirmación de contraseña
  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword.length === 0) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      setSuccessMessages(prev => ({ ...prev, confirmPassword: false }));
      return false;
    }

    if (password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
      setSuccessMessages(prev => ({ ...prev, confirmPassword: false }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      setSuccessMessages(prev => ({ ...prev, confirmPassword: true }));
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formData;

    // Validaciones finales
    let isValid = true;

    if (username.trim().length < 3) {
      validateUsername(username);
      isValid = false;
    }

    if (!validatePassword(password)) {
      isValid = false;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/usuario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta cruda del backend:', errorText);
        throw new Error('El backend respondió con un error. Ver consola para más detalles.');
      }


      const data = await response.json();

      alert(`¡Cuenta creada exitosamente!\nBienvenido, ${data.username || username.trim()}!`);

      // Resetear formulario
      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setSuccessMessages({});
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      });

      console.log('Usuario registrado:', data);

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al crear la cuenta. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };


  // Manejar botón de retroceso
  const handleBack = () => {
    const hasChanges = formData.username || formData.password || formData.confirmPassword;
    
    if (hasChanges) {
      if (window.confirm('¿Estás seguro de que quieres salir? Se perderán todos los cambios.')) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  // Manejar enlace a login
  const handleLoginLink = (e) => {
    window.location.href = '/iniciarsesion'; // Ejemplo de redirección
  };

  // Obtener clase CSS para form-group
  const getFormGroupClass = (fieldName) => {
    let baseClass = 'form-group';
    if (errors[fieldName] && errors[fieldName] !== '') {
      baseClass += ' error';
    } else if (successMessages[fieldName]) {
      baseClass += ' success';
    }
    return baseClass;
  };

  // Renderizar requisito de contraseña
  const renderRequirement = (isValid, text) => {
    const className = `requirement ${isValid ? 'valid' : 'invalid'}`;
    const icon = isValid ? '✓' : '○';
    
    return (
      <div className={className}>
        <span className="requirement-icon">{icon}</span>
        {text}
      </div>
    );
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Crear Cuenta</h1>
        <p>Únete a nuestra comunidad</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={getFormGroupClass('username')}>
          <label htmlFor="username">Nombre de usuario *</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && (
            <div className="error-message" style={{ display: 'block' }}>
              {errors.username}
            </div>
          )}
          {successMessages.username && (
            <div className="success-message" style={{ display: 'block' }}>
              ✓ Nombre de usuario disponible
            </div>
          )}
        </div>

        <div className={getFormGroupClass('password')}>
          <label htmlFor="password">Contraseña *</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crea una contraseña segura"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && (
            <div className="error-message" style={{ display: 'block' }}>
              {errors.password}
            </div>
          )}
          
          <div className="password-requirements">
            <h4>Requisitos de la contraseña:</h4>
            {renderRequirement(passwordRequirements.length, 'Al menos 8 caracteres')}
            {renderRequirement(passwordRequirements.uppercase, 'Una letra mayúscula')}
            {renderRequirement(passwordRequirements.lowercase, 'Una letra minúscula')}
            {renderRequirement(passwordRequirements.number, 'Un número')}
          </div>
        </div>

        <div className={getFormGroupClass('confirmPassword')}>
          <label htmlFor="confirmPassword">Confirmar contraseña *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {errors.confirmPassword && (
            <div className="error-message" style={{ display: 'block' }}>
              {errors.confirmPassword}
            </div>
          )}
          {successMessages.confirmPassword && (
            <div className="success-message" style={{ display: 'block' }}>
              ✓ Las contraseñas coinciden
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="login-section">
        <p>¿Ya tienes una cuenta?</p>
        <a href="/iniciarsesion" className="register-btn" onClick={handleLoginLink}>
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
};

export default Register;