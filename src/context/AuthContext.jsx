import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp;
        const now = Date.now() / 1000;

        if (exp > now) {
          setUser({ nombre: decoded.sub });
        } else {
          localStorage.removeItem('access_token');
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('access_token', token);
    const decoded = jwtDecode(token);
    setUser({ nombre: decoded.sub });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
