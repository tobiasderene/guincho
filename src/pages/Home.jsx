import '../styles/Home.css';
import WheelLoader from '../components/WheelLoader';
import BotonPlus from '../components/BotonPlus';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 7;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = (process.env.REACT_APP_API_URL || '').replace(/^http:/, 'https:');

  const fetchPublicaciones = async () => {
    if (loading) return; // evitar llamadas duplicadas
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/publicacion/?skip=${skip}&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.publicaciones) throw new Error('Datos inválidos recibidos del backend');

      // Filtrar duplicados por id, por si acaso
      setPublicaciones(prev => [
        ...prev,
        ...data.publicaciones.filter(
          pub => !prev.some(p => p.id === pub.id)
        ),
      ]);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error al traer publicaciones:', err);
      setError('No se pudo cargar las publicaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const handleVerMas = () => {
    setSkip(prev => prev + limit);
  };

  return (
    <div className="main-content" style={{ position: 'relative' }}>
      {/* Hero */}
      <section className="hero">
        <h1>Pasión por los Autos</h1>
        <p>El blog donde los motores rugen.</p>
      </section>

      {/* Grid de publicaciones */}
      <section className="cars-grid">
        {publicaciones.map(pub => (
          <div key={pub.id} className="car-card">
            <img
              className="car-image"
              src={pub.url_portada || '/cars/default.jpg'}
              alt={pub.titulo}
            />
            <div className="car-content">
              <h2 className="car-title">{pub.titulo}</h2>
              <p className="car-description">{pub.descripcion_corta}</p>
              <div className="car-meta">
                <span className="car-date">
                  Publicado:{' '}
                  {new Date(pub.fecha_publicacion || Date.now()).toLocaleDateString()}
                </span>
                <a className="read-more" href={`/publicacion/${pub.id}`}>
                  Leer más
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Estado de carga o error */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <WheelLoader />
          <p style={{ marginTop: '1rem', color: '#666' }}>Cargando publicaciones...</p>
        </div>
      )}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* Botón "Ver más" */}
      {!loading && skip + limit < total && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button onClick={handleVerMas} className="ver-mas-btn">
            Ver más
          </button>
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
