import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/me`, {
          credentials: 'include' 
        });

        if (!res.ok) throw new Error('No autorizado');

        const data = await res.json();
        setUser(data.usuario); // Esto viene del backend

      } catch {
        setUser(null);

      }
    };

    fetchUser();
  }, []);

  return { user };
};
