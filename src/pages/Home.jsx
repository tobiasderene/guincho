import React from 'react';
import '../styles/Home.css';
import Header from "./components/Header";
import BotonPlus from '../components/BotonPlus';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="main-content" style={{ position: 'relative' }}>
      
      <Header />
      {/* Header superior con ícono de usuario */}

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
      </div>

      {/* Hero principal */}
      <section className="hero">
        <h1>Pasión por los Autos</h1>
        <p>El blog donde los motores rugen.</p>
      </section>

      {/* Grid de autos */}
      <section className="cars-grid">
        {/* Card de auto (de ejemplo) */}
        <div className="car-card">
          <img className="car-image" src="/cars/auto1.jpg" alt="Auto 1" />
          <div className="car-content">
            <h2 className="car-title">Toyota GR86</h2>
            <p className="car-description">Un deportivo ágil, accesible y con mucha onda.</p>
            <div className="car-meta">
              <span className="car-date">Publicado: 28 Jul 2025</span>
              <a className="read-more" href="#">Leer más</a>
            </div>
          </div>
        </div>
      </section>

      {/* Botón flotante para crear publicación */}
      {user && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 1000,
        }}>
          <BotonPlus onClick={() => alert('Aquí tu lógica para crear publicación')} />
        </div>
      )}
    </div>
  );
};

export default Home;
