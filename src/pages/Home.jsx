import '../styles/Home.css';
import BotonPlus from '../components/BotonPlus';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 7; // cantidad por página
  const [total, setTotal] = useState(0);

  // Función para traer publicaciones
  const fetchPublicaciones = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/publicacion?skip=${skip}&limit=${limit}`);
      const text = await res.text();  // 👈 recibe texto crudo
      console.log('Respuesta cruda:', text);
      const data = JSON.parse(text);  // parse manual para ver si falla
      setPublicaciones(prev => [...prev, ...data.publicaciones]);
      setTotal(data.total);
    } catch (err) {
      console.error('Error al traer publicaciones:', err);
    }
  };

  // Traer la primera tanda al cargar la página
  useEffect(() => {
    fetchPublicaciones();
  }, [skip]);

  // Función para "ver más"
  const handleVerMas = () => {
    setSkip(prev => prev + limit);
  };

  return (
    <div className="main-content" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}></div>

      <section className="hero">
        <h1>Pasión por los Autos</h1>
        <p>El blog donde los motores rugen.</p>
      </section>

      <section className="cars-grid">
        {publicaciones.map(pub => (
          <div key={pub.id} className="car-card">
            <img className="car-image" src={pub.url_portada || '/cars/default.jpg'} alt={pub.titulo} />
            <div className="car-content">
              <h2 className="car-title">{pub.titulo}</h2>
              <p className="car-description">{pub.descripcion_corta}</p>
              <div className="car-meta">
                <span className="car-date">Publicado: {new Date(pub.fecha_publicacion).toLocaleDateString()}</span>
                <a className="read-more" href={`/publicacion/${pub.id}`}>Leer más</a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Botón "Ver más" si hay más publicaciones */}
      {skip + limit < total && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button onClick={handleVerMas} className="ver-mas-btn">Ver más</button>
        </div>
      )}

      {/* Botón flotante para crear publicación */}
      {user && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 1000 }}>
          <a href="/crearpost">
            <BotonPlus />
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
