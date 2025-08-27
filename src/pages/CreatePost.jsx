import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import BackButton from '../components/BackButton';

export default function CreatePost() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [link, setLink] = useState('');
  const [year, setYear] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [publishing, setPublishing] = useState(false);

  // --- Obtener categorías y marcas ---
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, marcaRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/v1/categoria/`),
          fetch(`${process.env.REACT_APP_API_URL}/api/v1/marca/`)
        ]);

        if (!catRes.ok || !marcaRes.ok) throw new Error("Error cargando combos");

        const [catData, marcaData] = await Promise.all([catRes.json(), marcaRes.json()]);
        setCategorias(catData);
        setMarcas(marcaData);
      } catch (err) {
        console.error("Error cargando categorías o marcas:", err);
      }
    }

    fetchData();
  }, []);

  // --- Manejo de archivos ---
  const handleFiles = files => {
    const valid = files.filter(file => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
    setSelectedFiles(prev => [...prev, ...valid]);
  };

  const onFileChange = e => handleFiles(Array.from(e.target.files));

  const onDrop = e => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setTitle('');
    setShortDesc('');
    setLongDesc('');
    setCaracteristicas('');
    setLink('');
    setYear('');
    setCategoria('');
    setMarca('');
  };


  const handleSubmit = async e => {
    e.preventDefault();

    if (!shortDesc.trim() || !longDesc.trim() || !caracteristicas.trim() || !title.trim() || !year || !categoria || !marca) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setPublishing(true);

    try {
      const form = new FormData();
      form.append("titulo", title);
      form.append("descripcion_corta", shortDesc);
      form.append("descripcion", longDesc);
      form.append("detalle", caracteristicas);
      form.append("url", link || "");
      form.append("year_vehiculo", year);
      form.append("id_categoria_vehiculo", categoria);
      form.append("id_marca_vehiculo", marca);

      // Adjuntar todas las imágenes con timestamp
      selectedFiles.forEach(file => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
        const newFile = new File([file], `${timestamp}_${file.name}`, { type: file.type });
        form.append("files", newFile);
      });

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/publicacion/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        body: form
      });

      if (!res.ok) throw new Error(`Error al crear publicación, status: ${res.status}`);

      const data = await res.json();
      console.log("✅ Publicación creada:", data);

      alert('¡Publicación creada exitosamente!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al publicar");
    } finally {
      setPublishing(false);
    }
  };                          


  return (
    <div className="login-container">
      <BackButton/>
      <div className="login-logo">
        <h1>Crear Publicación</h1>
        <p>Comparte tu contenido con la comunidad</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* --- Foto(s) --- */}
        <div className="form-group">
          <label>Fotografías</label>
          <div
            className="file-input-container"
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
            onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
            onDrop={onDrop}
          >
            <input type="file" multiple accept="image/*" onChange={onFileChange} />
            <div className="file-input-content">
              <div className="upload-icon">📷</div>
              <div className="file-input-text">Haz clic o arrastra tus fotos aquí</div>
              <div className="file-input-subtext">PNG, JPG, GIF hasta 10MB cada una</div>
            </div>
          </div>
          {selectedFiles.length > 0 && (
            <div className="file-preview">
              <div style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '10px' }}>
                {selectedFiles.length} foto(s) seleccionada(s)
              </div>
              <div className="preview-grid">
                {selectedFiles.map((file, idx) => (
                  <div className="preview-item" key={idx}>
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <button type="button" className="remove-btn" onClick={() => removeFile(idx)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- Campos del form --- */}
        <div className='form-group'> 
          <label>Titulo *</label>
          <textarea value={title} onChange={e => setTitle(e.target.value)} maxLength={50} required />
        </div>

        <div className="form-group">
          <label>Descripción corta *</label>
          <textarea
            value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
            maxLength={150}
            required
          />
          <div className={`char-counter ${shortDesc.length > 135 ? 'error' : shortDesc.length > 120 ? 'warning' : ''}`}>
            {shortDesc.length}/150
          </div>
        </div>

        <div className="form-group">
          <label>Descripción detallada *</label>
          <textarea
            className="long-description"
            value={longDesc}
            onChange={e => setLongDesc(e.target.value)}
            maxLength={5000}
            required
          />
          <div className={`char-counter ${longDesc.length > 5000 ? 'error' : longDesc.length > 4500 ? 'warning' : ''}`}>
            {longDesc.length}/5000
          </div>
        </div>

        <div className="form-group">
          <label>Características *</label>
          <textarea
            className="long-description"
            value={caracteristicas}
            onChange={e => setCaracteristicas(e.target.value)}
            maxLength={2000}
            required
          />
          <div className={`char-counter ${caracteristicas.length > 2000 ? 'error' : caracteristicas.length > 1800 ? 'warning' : ''}`}>
            {caracteristicas.length}/2000
          </div>
        </div>

        <div className="form-group">
          <label>Año del vehículo *</label>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Categoría *</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria_vehiculo} value={cat.id_categoria_vehiculo}>
                {cat.nombre_categoria_vehiculo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Marca *</label>
          <select value={marca} onChange={e => setMarca(e.target.value)} required>
            <option value="">Seleccione una marca</option>
            {marcas.map(m => (
              <option key={m.id_marca_vehiculo} value={m.id_marca_vehiculo}>
                {m.nombre_marca_vehiculo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enlace opcional</label>
          <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://ejemplo.com (opcional)" />
        </div>
        
        <div className="button-group">
          <button type="submit" className="publish-btn" disabled={publishing}>
            {publishing ? 'Publicando...' : 'Publicar'}
          </button>
          <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
