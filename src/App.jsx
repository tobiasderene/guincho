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
        {/* Rutas específicas */}
        <Route path="/inicio" element={<Home />} />
        <Route path="/categorias" element={<Category />} />
        <Route path="/iniciarsesion" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
