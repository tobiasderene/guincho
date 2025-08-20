import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 👈 Importá tu provider
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import './styles/styles.css';

function App() {
  return (
    <AuthProvider> {/* 👈 Meté tu contexto acá */}
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Category />} />
          <Route path="/iniciarsesion" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/crearpost" element={<CreatePost/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
