import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../styles/Header.css'; // Asegurate que esta ruta sea correcta

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', searchQuery);
    // Agregá tu lógica real de búsqueda acá
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Guincho</div>

        <div className="nav-section">
          <nav className="nav-left">
            <a href="inicio">Inicio</a>
            <a href="categorias">Categorías</a>
          </nav>

          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Buscar vehiculos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="search-input"
              />
            </div>
          </div>

          <nav className="nav-right">
            <a href="iniciarsesion">Iniciar Sesión</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;