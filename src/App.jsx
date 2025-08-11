import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Login from "./pages/Login.jsx";
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />

        {/* Rutas específicas */}
        <Route path="/categorias" element={<Category />} />
        <Route path="/iniciarsesion" element={<Login />} />

        {/* Catch-all para redirección */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
