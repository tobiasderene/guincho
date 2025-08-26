import '../styles/Post.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Post = () => {
  const { id } = useParams(); // <-- para tomar el id desde la URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/v1/publicacion/${id}`
        );
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error cargando publicación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Cargando publicación...</div>;
  if (!post) return <div>No se encontró la publicación</div>;

  return (
    <div className="publication-container">
      
      {/* Imagen portada */}
      <div className="image-container">
            {post.url_portada ? (
                <img src={post.url_portada} alt={post.titulo} />
            ) : (
                <div className="image-placeholder">Sin imagen</div>
            )}
        </div>
     <div className="content-wrapper">
         {/* Marca, Categoría, Año */}
         <div className="vehicle-info">
           <div className="category">{post.titulo}</div>
           <div className="brand">{post.nombre_marca_vehiculo}</div>
           <div className="category">{post.nombre_categoria_vehiculo}</div>
           <div className="year">{post.year_vehiculo}</div>
         </div>
             {/* Usuario */}
         <div className="user-info">
           Publicado por: <b>{post.nombre_usuario}</b>
         </div>
             {/* Contenido */}
         <div className="content-layout">
           {/* Título y Descripción */}
           
           <div className="description-section">
              {post.descripcion.split("\n").map((parrafo, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <p className="description-text">{parrafo}</p>
                  {post.imagenes && post.imagenes[idx + 1] && ( // +1 porque la [0] es la portada
                    <img
                      src={post.imagenes[idx + 1]}
                      alt={`detalle-${idx}`}
                      style={{ maxWidth: "100%", margin: "10px 0", borderRadius: "8px" }}
                    />
                  )}
                </div>
              ))}
            </div>
               {/* Detalle / Especificaciones */}
           <div className="specs-section">
               <h3>Detalles</h3>
               <p style={{ whiteSpace: 'pre-line' }}>{post.detalle}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
