import React from 'react';
import '../styles/Home.css';

const Home = () => (
  <div className="main-content">
    <section className="hero">
      <h1>Pasión por los Autos</h1>
      <p>El blog donde los motores rugen.</p>
    </section>

    <section className="cars-grid">
      {/* Acá irían varios CarCard o contenido de autos */}
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
  </div>
);

export default Home;
