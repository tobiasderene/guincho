import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Por ahora simple: si hay token, está logueado
    const token = localStorage.getItem('token');
    if (token) {
      // Si querés, podés decodificar el token para sacar el nombre
      // Pero si no tenés librería, vamos a hacer algo simple por ahora
      // O asumir que el nombre lo guardás aparte (por ejemplo localStorage)
      const nombreUsuario = localStorage.getItem('nombre_usuario') || 'Usuario';
      setUser({ nombre: nombreUsuario });
    } else {
      setUser(null);
    }
  }, []);

  return { user };
};
