import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/SignUp.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import './styles/styles.css';
import Post from "./pages/Post.jsx";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Cargar el script externo
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-J2PFQF4155";
    script.async = true;
    document.head.appendChild(script);

    // Definir la función global gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag; // lo dejamos global para reutilizarlo
    gtag("js", new Date());
    gtag("config", "G-J2PFQF4155");
  }, []);

  // 👇 cada vez que cambia la ruta, avisamos a GA
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-J2PFQF4155", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  // Rutas donde NO queremos mostrar el header
  const hideHeaderRoutes = ["/iniciarsesion", "/registrarse", "/crearpost"];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Category />} />
        <Route path="/iniciarsesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/crearpost" element={<CreatePost />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
