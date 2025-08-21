import React, { useState } from 'react';
import '../styles/Login.css';

export default function CreatePost() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [link, setLink] = useState('');
  const [publishing, setPublishing] = useState(false);

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
    setShortDesc('');
    setLongDesc('');
    setLink('');
  };

  // --- Función para subir imagenes con signed URL ---
  async function uploadImage(file) {
    try {
      // 1️⃣ Pedir signed URL al backend
      const res = await fetch(`${process.env.REACT_APP_API_URL}/uploads/signed-url?filename=${encodeURIComponent(file.name)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // si tu endpoint exige auth
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener signed URL");
      const { upload_url, public_url } = await res.json();

      // 2️⃣ Subir el archivo al bucket usando PUT
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!uploadRes.ok) throw new Error("Error subiendo la imagen al bucket");

      // 3️⃣ Devolver la URL pública para la DB
      return public_url;
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      throw err;
    }
  }

  // --- Manejo de envío de formulario ---
  const handleSubmit = async e => {
    e.preventDefault();
    if (!shortDesc.trim() || !longDesc.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setPublishing(true);

    try {
      // Subir todas las imágenes y obtener URLs públicas
      const uploadedUrls = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const url = await uploadImage(selectedFiles[i]);
        uploadedUrls.push(url);
      }

      // Preparar payload para el backend
      const payload = {
        short_description: shortDesc,
        long_description: longDesc,
        link: link || null,
        imagenes: uploadedUrls.map((url, idx) => ({
          url_foto: url,
          imagen_portada: idx === 0, // primera imagen como portada
        })),
      };

      // Enviar al backend
      const res = await fetch(`${process.env.REACT_APP_API_URL}/publicacion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear publicación");

      const data = await res.json();
      console.log("Publicación creada:", data);

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
