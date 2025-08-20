import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../styles/Header.css';
import UserIconSimple from '../components/UserIconSimple';
import UserIconName from '../components/UserIconName';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', searchQuery);
    // Tu lógica acá
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Guincho</div>

        <div className="nav-section">
          <nav className="nav-left">
            <a href="/">Inicio</a>
            <a href="categorias">Categorías</a>
          </nav>

          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Buscar vehículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="search-input"
              />
            </div>
          </div>

          <nav className="nav-right" style={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <a href="/perfil" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <UserIconName userName={user.nombre} />
              </a>
            ) : (
              <a href="/iniciarsesion" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <UserIconSimple />
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
