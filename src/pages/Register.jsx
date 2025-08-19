import { useState } from 'react';
import '../styles/Register.css';

function Registro() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessages, setSuccessMessages] = useState({});
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const { username, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      const requirements = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value)
      };
      setPasswordRequirements(requirements);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const newSuccessMessages = {};

    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
    else newSuccessMessages.username = 'Nombre de usuario válido.';

    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    else if (!Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = 'La contraseña no cumple con todos los requisitos.';
    } else newSuccessMessages.password = 'Contraseña válida.';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    else newSuccessMessages.confirmPassword = 'Las contraseñas coinciden.';

    setErrors(newErrors);
    setSuccessMessages(newSuccessMessages);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/usuario`, {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario.');
      }

      alert(`¡Cuenta creada exitosamente!\nBienvenido, ${username.trim()}!`);

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

      console.log('Usuario registrado:', { username: username.trim(), password });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert(`Error al crear la cuenta: ${error.message}`);
    }
  };

  return (
    <div className="registro-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="registro-form">
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
          {successMessages.username && <p className="success">{successMessages.username}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
          {successMessages.password && <p className="success">{successMessages.password}</p>}

          <ul className="password-requirements">
            <li className={passwordRequirements.length ? 'ok' : ''}>Mínimo 8 caracteres</li>
            <li className={passwordRequirements.uppercase ? 'ok' : ''}>Una mayúscula</li>
            <li className={passwordRequirements.lowercase ? 'ok' : ''}>Una minúscula</li>
            <li className={passwordRequirements.number ? 'ok' : ''}>Un número</li>
          </ul>
        </div>

        <div>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          {successMessages.confirmPassword && <p className="success">{successMessages.confirmPassword}</p>}
        </div>

        <button type="submit">Crear cuenta</button>
      </form>

      <div className="register-section">
        <p>¿Ya tienes una cuenta?</p>
        <a href="/iniciarsesion" className="register-btn">Iniciar sesión</a>
      </div>
    </div>
  );
}

export default Registro;
