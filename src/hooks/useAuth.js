import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('No autorizado');

        const data = await res.json();
        setUser(data.usuario);

      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return { user };
};
