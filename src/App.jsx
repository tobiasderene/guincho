import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import './styles/styles.css';

function AppContent() {
  const location = useLocation();
  
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
