// src/components/VehicleFilters.jsx
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import '../styles/Category.css';

const VehicleFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    modelo: '',
    categoria: '',
    marca: '',
    nacionalidad: '',
    año: ''
  });
  const [activeFilters, setActiveFilters] = useState(0);

  const filterOptions = {
    categoria: ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Coupé', 'Convertible', 'Camioneta'],
    marca: ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Nissan', 'Hyundai', 'Volkswagen', 'BMW', 'Mercedes-Benz'],
    nacionalidad: ['Japonés', 'Americano', 'Coreano', 'Alemán', 'Francés', 'Italiano', 'Chino'],
    año: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    const activeCount = Object.values(newFilters).filter(val => val !== '').length;
    setActiveFilters(activeCount);
  };

  const clearFilter = (filterType) => {
    handleFilterChange(filterType, '');
  };

  const clearAllFilters = () => {
    setFilters({ modelo: '', categoria: '', marca: '', nacionalidad: '', año: '' });
    setActiveFilters(0);
  };

  const handleSearch = () => {
    console.log('Búsqueda:', searchQuery);
    console.log('Filtros:', filters);
  };

  return (
    <div className="vehicle-filters-page">
      <main className="main-container">
        <div className="filters-header">
          <div className="filters-info">
            {activeFilters > 0 && (
              <div className="filters-counter">
                <span>{activeFilters} filtro{activeFilters > 1 ? 's' : ''} activo{activeFilters > 1 ? 's' : ''}</span>
                <button onClick={clearAllFilters}><X size={16} /> Limpiar todo</button>
              </div>
            )}
          </div>
        </div>

        <div className="filters-box">
          <div className="filters-title">
            <Filter size={20} />
            <h2>Filtros de Búsqueda</h2>
          </div>

          <div className="filters-grid">
            {['modelo', 'categoria', 'marca', 'nacionalidad', 'año'].map((key) => (
              <div key={key} className="filter-item">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <div className="input-wrapper">
                  {key === 'modelo' ? (
                    <input
                      type="text"
                      placeholder="Ej: Corolla, Civic..."
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    />
                  ) : (
                    <select
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    >
                      <option value="">Seleccionar {key}</option>
                      {filterOptions[key]?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {filters[key] && (
                    <button onClick={() => clearFilter(key)} className="clear-btn">
                      <X size={16} />
                    </button>
                  )}
                  {key !== 'modelo' && <ChevronDown className="dropdown-icon" size={16} />}
                </div>
              </div>
            ))}
          </div>

          <div className="search-button-container">
            <button onClick={handleSearch}>
              <Search size={18} /> Buscar Vehículos
            </button>
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="applied-filters-box">
            <h3>Filtros Aplicados</h3>
            <div className="applied-tags">
              {Object.entries(filters).map(([key, value]) =>
                value && (
                  <span key={key} className="tag">
                    <span>{key}:</span>
                    <span>{value}</span>
                    <button onClick={() => clearFilter(key)}>
                      <X size={12} />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div className="results-placeholder">
          <Search size={48} />
          <h3>Resultados de Búsqueda</h3>
          <p>Los vehículos que coincidan con tus filtros aparecerán aquí</p>
        </div>
      </main>
    </div>
  );
};

export default VehicleFilters;
