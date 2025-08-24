import React, { useState, useEffect } from 'react';
import '../styles/Login.css';

export default function CreatePost() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [link, setLink] = useState('');
  const [year, setYear] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [publishing, setPublishing] = useState(false);

  // --- Obtener categorías y marcas del backend ---
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
    setLink('');
    setYear('');
    setCategoria('');
    setMarca('');
  };

  // --- Función para subir imagenes con signed URL ---
  async function uploadImage(file) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/upload/signed-url?filename=${encodeURIComponent(file.name)}`;
      const token = localStorage.getItem("access_token");

      console.log("🚀 Llamando al endpoint:", url);
      console.log("🔑 Token enviado:", token);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Respuesta raw del endpoint:", res);

      if (!res.ok) throw new Error(`No se pudo obtener signed URL, status: ${res.status}`);

      const { upload_url, public_url } = await res.json();
      console.log("📄 Signed URL recibida:", { upload_url, public_url });

      const uploadRes = await fetch(upload_url, {
        method: 'PUT',
        body: file
      });

      console.log("📤 Resultado subida al bucket:", uploadRes);

      if (!uploadRes.ok) throw new Error("Error subiendo la imagen al bucket");

      return public_url;
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      throw err;
    }
  }

  // --- Manejo de envío de formulario ---
  const handleSubmit = async e => {
    e.preventDefault();
    if (!shortDesc.trim() || !longDesc.trim() || !title.trim() || !year || !categoria || !marca) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setPublishing(true);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const url = await uploadImage(selectedFiles[i]);
        uploadedUrls.push(url);
      }

      const payload = {
        id_usuario: 1, // ⚠️ reemplazar por el usuario del token si querés usar el real
        descripcion: longDesc,
        fecha_publicacion: new Date().toISOString(),
        descripcion_corta: shortDesc,
        titulo: title,
        url: link || null,
        year_vehiculo: parseInt(year),
        id_categoria_vehiculo: parseInt(categoria),
        id_marca_vehiculo: parseInt(marca),
        detalle: longDesc,
        imagenes: uploadedUrls.map((url, idx) => ({
          url_foto: url,
          imagen_portada: idx === 0
        })),
      };

      console.log("📦 Payload a enviar:", payload);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/publicacion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Respuesta de creación de publicación:", res);

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
      <div className="logo">
        <h1>Crear Publicación</h1>
        <p>Comparte tu contenido con la comunidad</p>
      </div>
      <form onSubmit={handleSubmit}>
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

        <div className='form-group'> 
          <label>Titulo *</label>
          <textarea
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={50}
            required
          />
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
            maxLength={1000}
            required
          />
          <div className={`char-counter ${longDesc.length > 900 ? 'error' : longDesc.length > 800 ? 'warning' : ''}`}>
            {longDesc.length}/1000
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
          <button type="submit" className="publish-btn" disabled={publishing}>{publishing ? 'Publicando...' : 'Publicar'}</button>
          <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
